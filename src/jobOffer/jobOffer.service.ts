import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketService } from 'src/socket/socket.service';
import { CreateJobOfferDto } from './dto/jobOffer.dto';

@Injectable()
export class JobOfferService {
  constructor(
    private readonly gw: SocketService,
    private prisma: PrismaService,
  ) {}

  async createJobOffer(
    userId: number,
    jobId: number,
    jobOfferDto: CreateJobOfferDto,
  ) {
    try {
      const jobOffer = await this.prisma.jobOffer.create({
        data: { ...jobOfferDto, jobId, userId },
      });

      const job = await this.prisma.job.findFirst({
        where: {
          id: jobId,
        },
      });

      this.gw.socket.emit('job', {
        id: jobOffer.id,
        type: 'offer-received',
        receiverId: job.userId,
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
      const user = await this.prisma.user.findUnique({
        where: {
          id: jobOffer.userId,
        },
        select: {
          ratings: true,
          jobsDone: true,
          name: true,
          lastName: true,
        },
      });

      const ratings =
        user.ratings.reduce((a, b) => a + b.rating, 0) / user.ratings.length;
      const jobsDone = user.jobsDone.length;

      return { ...jobOffer, user: { ...user, ratings, jobsDone } };
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

      await this.prisma.jobOffer.updateMany({
        where: {
          jobId: jobOffer.jobId,
        },
        data: {
          expired: true,
        },
      });

      await this.prisma.user.update({
        where: { id: jobOffer.userId },
        data: {
          currentlyWorkingOnJobId: jobOffer.jobId,
        },
      });

      this.gw.socket.emit('job', {
        id: job.id,
        type: 'offer-accepted',
        receiverId: jobOffer.userId,
      });
      return { msg: 'Offer accepted' };
    } catch (error) {
      throw new Error(error);
    }
  }
}
