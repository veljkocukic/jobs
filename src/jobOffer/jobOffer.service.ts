import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Job } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { checkIfExistsAndReturn } from 'src/utils/helpers';
import { CreateJobOfferDto } from './dto/jobOffer.dto';

@Injectable()
export class JobOfferService {
  constructor(private prisma: PrismaService) {}

  async createJobOffer(
    userId: number,
    jobId: number,
    jobOfferDto: CreateJobOfferDto,
  ) {
    try {
      const jobOffer = await this.prisma.jobOffer.create({
        data: { ...jobOfferDto, jobId, userId },
      });
      return jobOffer;
    } catch (error) {
      return error;
    }
  }
  async deleteJobOffer(jobOfferId: number) {
    try {
      await this.prisma.jobOffer.delete({ where: { id: jobOfferId } });
      return { msg: 'Job offer successfully deleted' };
    } catch (error) {
      return error;
    }
  }

  async getSingleJobOffer(jobOfferId: number) {
    try {
      const jobOffer = await this.prisma.jobOffer.findUnique({
        where: { id: jobOfferId },
      });
      return jobOffer;
    } catch (error) {
      return error;
    }
  }

  async acceptJobOffer(jobOfferId: number, userId: number) {
    try {
      const jobOffer = await this.prisma.jobOffer.findUnique({
        where: { id: jobOfferId },
      });

      const job = await this.prisma.job.findUnique({
        where: { id: jobOffer.jobId },
      });

      if (job.userId !== userId) {
        throw new UnauthorizedException('You cannot accept this offer');
      }

      await this.prisma.job.update({
        where: { id: job.id },
        data: {
          ...job,
          hasAcceptedOffer: true,
          acceptedOfferId: jobOffer.id,
          status: 'IN_PROGRESS',
        },
      });

      await this.prisma.user.update({
        where: { id: jobOffer.userId },
        data: {
          currentlyWorkingOnJobId: jobOffer.userId,
        },
      });

      return { msg: 'Offer accepted' };
    } catch (error) {}
  }
}
