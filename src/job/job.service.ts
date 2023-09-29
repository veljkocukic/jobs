import { Injectable } from '@nestjs/common';
import { EventsGateway } from 'src/events/events.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { checkIfExistsAndReturn } from 'src/utils/helpers';
import { ITableJob } from 'src/utils/interfaces';
import { CompleteAndRateDTO } from './dto/completeAndRate.dto';
import { CreateJobDto } from './dto/createJob.dto';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService, private gw: EventsGateway) {}
  async createJob(userId: number, jobDto: CreateJobDto) {
    const job = await this.prisma.job.create({
      data: { ...jobDto, userId, date: new Date(jobDto.date).toISOString() },
    });

    this.gw.server.emit('job', {
      category: job.category,
      id: job.id,
      type: 'job-created',
    });
    return job;
  }

  async getSingleJob(jobId: number) {
    const job = await this.prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });
    const jobOffers = await this.prisma.jobOffer.findMany({
      where: { jobId: jobId },
      take: 6,
      select: {
        price: true,
        id: true,
        user: {
          select: { name: true, lastName: true, ratings: true },
        },
      },
    });

    return checkIfExistsAndReturn(
      {
        ...job,
        jobOffers: jobOffers.map((o) => ({
          ...o,
          user: {
            ...o.user,
            ratings:
              o.user.ratings.reduce((a, b) => a + b.rating, 0) /
              o.user.ratings.length,
          },
        })),
      },
      'Job not found',
    );
  }

  async getAllJobs(
    page: number,
    limit: number,
    userId: number,
  ): Promise<{ data: ITableJob[]; count: number; pageCount: number }> {
    const skip = (page - 1) * limit;
    const jobs = await this.prisma.job.findMany({
      skip,
      take: limit,
      where: {
        userId,
      },
      select: {
        name: true,
        status: true,
        date: true,
        category: true,
        id: true,
        jobOffers: true,
      },
    });

    const count = await this.prisma.job.count({
      where: {
        userId,
      },
    });
    const pageCount = count / limit;
    return {
      data: jobs.map((j) => ({ ...j, jobOffers: j.jobOffers.length })),
      count,
      pageCount,
    };
  }

  async deleteJob(jobId: number) {
    try {
      await this.prisma.job.delete({ where: { id: jobId } });
      return { msg: 'Job successfully deleted' };
    } catch (error) {
      return error;
    }
  }

  async completeAndRate(
    userId: number,
    jobId: number,
    dto: CompleteAndRateDTO,
  ) {
    try {
      const job = await this.prisma.job.findUnique({
        where: {
          id: jobId,
        },
        select: {
          currentlyWorkingOnUser: true,
        },
      });

      await this.prisma.rating.create({
        data: {
          description: dto.description,
          rating: dto.rating,
          ratingGiverId: userId,
          userRatedId: job.currentlyWorkingOnUser.id,
        },
      });

      await this.prisma.job.update({
        where: { id: jobId },
        data: {
          status: 'DONE',
          userThatDidTheJobId: job.currentlyWorkingOnUser.id,
        },
      });

      await this.prisma.user.update({
        where: {
          id: job.currentlyWorkingOnUser.id,
        },
        data: {
          currentlyWorkingOn: {
            disconnect: {
              id: jobId,
            },
          },
        },
      });
    } catch (error) {
      return error;
    }
  }

  async getJobOverview(userId: number) {
    try {
      const allJobs = await this.prisma.job.count({
        where: {
          userId,
        },
      });

      const completed = await this.prisma.job.count({
        where: {
          userId,
          status: 'DONE',
        },
      });

      const inProgress = await this.prisma.job.count({
        where: {
          userId,
          status: 'IN_PROGRESS',
        },
      });

      const waitingForWorker = await this.prisma.job.count({
        where: {
          userId,
          status: 'ACTIVE',
        },
      });

      return {
        allJobs,
        completed,
        inProgress,
        waitingForWorker,
      };
    } catch (error) {
      return error;
    }
  }

  async getAvailableWorkerJobs(page: number, limit: number, userId: number) {
    const skip = (page - 1) * limit;

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const categories =
      '(' + user.categories.map((c) => "'" + c + "'").join(', ') + ')';
    const coords = user.areaOfWork
      .map((a: any) => `[${a.lat}, ${a.lng}]`)
      .join(', ');
    const jobs = await this.prisma.$queryRawUnsafe(`
    SELECT
      name, location, date, price_type, price, currency, category, amount, id
    FROM
      jobs 
    WHERE 
      status = 'ACTIVE' 
      AND CAST(category AS TEXT ) IN ${categories}
      AND ST_Intersects(
        ST_SetSRID(ST_MakePoint((location->>'lat')::double precision, (location->>'lng')::double precision), 4326),
        ST_SetSRID(ST_GeomFromGeoJSON('{
            "type": "Polygon",
            "coordinates": [
                [ ${coords} ]
            ]
        }'), 4326)
    )
    LIMIT 
      ${limit}
    OFFSET
      ${skip}
      `);
    const count = await this.prisma.job.count({
      where: {
        category: {
          in: user.categories,
        },
      },
    });
    const pageCount = count / limit;
    return { data: jobs, count, pageCount };
  }
}
