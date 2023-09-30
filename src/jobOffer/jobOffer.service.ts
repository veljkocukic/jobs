import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Conversation } from '@prisma/client';
import { EventsGateway } from 'src/events/events.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJobOfferDto } from './dto/jobOffer.dto';

@Injectable()
export class JobOfferService {
  constructor(private prisma: PrismaService, private gw: EventsGateway) {}

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

      this.gw.server.emit('job', {
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

  async getJobOffers(jobId: number, page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;
      const jobOffers = await this.prisma.jobOffer.findMany({
        skip,
        take: limit,
        where: {
          jobId,
        },
        select: {
          id: true,
          user: {
            select: {
              name: true,
              lastName: true,
              ratings: true,
              jobsDone: true,
            },
          },
          description: true,
        },
      });

      const count = await this.prisma.jobOffer.count({
        where: {
          jobId,
        },
      });
      const pageCount = count / limit;
      return {
        data: jobOffers.map((j) => ({
          ...j,
          user: {
            ...j.user,
            jobsDone: j.user.jobsDone.length,
            ratings:
              j.user.ratings.reduce((a, b) => a + b.rating, 0) /
              j.user.ratings.length,
          },
        })),
        count,
        pageCount,
      };
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
          currentlyWorkingOnUserId: jobOffer.userId,
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
          currentlyWorkingOn: {
            connect: {
              id: jobOffer.jobId,
            },
          },
        },
      });

      let conversation: Conversation;
      const found = await this.prisma.conversation.findFirst({
        where: {
          participants: {
            every: {
              id: {
                in: [jobOffer.userId, userId],
              },
            },
          },
        },
      });

      if (found) {
        conversation = found;
      } else {
        conversation = await this.prisma.conversation.create({
          data: {
            participants: {
              connect: [{ id: jobOffer.userId }, { id: userId }],
            },
          },
        });
      }

      this.gw.server.emit('job', {
        id: job.id,
        type: 'offer-accepted',
        receiverId: jobOffer.userId,
      });
      return conversation;
    } catch (error) {
      throw new Error(error);
    }
  }
}
