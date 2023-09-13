import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { checkIfExistsAndReturn } from 'src/utils/helpers';
import { ITableJob } from 'src/utils/interfaces';
import { CompleteAndRateDTO } from './dto/completeAndRate.dto';
import { CreateJobDto } from './dto/createJob.dto';
import { SocketService } from 'src/socket/socket.service';

@Injectable()
export class JobService {
  constructor(
    private readonly gw: SocketService,
    private prisma: PrismaService,
  ) {}
  async createJob(userId: number, jobDto: CreateJobDto) {
    const job = await this.prisma.job.create({
      data: { ...jobDto, userId, date: new Date(jobDto.date).toISOString() },
    });

    this.gw.socket.emit('job', {
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
      },
    });

    const count = await this.prisma.user.count({});
    const pageCount = count / limit;
    return { data: jobs, count, pageCount };
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
          currentlyWorkingOnJobId: null,
        },
      });
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

    const jobsQuery: any = {
      skip,
      take: limit,
      select: {
        name: true,
        location: true,
        date: true,
        price: true,
        priceType: true,
        currency: true,
        category: true,
        amount: true,
        id: true,
      },
      where: {
        status: 'ACTIVE',
      },
    };
    if (user.categories.length > 0) {
      jobsQuery.where = {
        ...jobsQuery.where,
        category: {
          in: user.categories,
        },
      };
    }

    const jobs = await this.prisma.job.findMany(jobsQuery);

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
