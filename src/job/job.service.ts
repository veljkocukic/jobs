import { Injectable, NotFoundException } from '@nestjs/common';
import { Job } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { checkIfExistsAndReturn } from 'src/utils/helpers';
import { CreateJobDto } from './dto/createJob.dto';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async createJob(userId: number, jobDto: CreateJobDto) {
    const job = await this.prisma.job.create({
      data: { ...jobDto, userId, date: new Date(jobDto.date).toISOString() },
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
      select: {
        price: true,
        user: { select: { name: true, lastName: true, jobsDone: true } },
      },
    });

    return checkIfExistsAndReturn({ ...job, jobOffers }, 'Job not found');
  }

  async getAllJobs(
    page: number,
    limit: number,
    userId: number,
  ): Promise<{ data: Job[]; count: number; pageCount: number }> {
    const skip = (page - 1) * limit;

    const jobs = await this.prisma.job.findMany({
      skip,
      take: limit,
      where: {
        userId,
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
}
