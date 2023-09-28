import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { RegisterDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { checkIfExistsAndReturn } from 'src/utils/helpers';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMe() {
    const user = await this.prisma.user.findUnique({
      where: {
        id: 1,
      },
    });
    return user;
  }

  async getUserRatings(
    page: number,
    limit: number,
    userId: number,
    clientUserId?: number,
  ) {
    const skip = (page - 1) * limit;
    const ratings = await this.prisma.rating.findMany({
      where: { userRatedId: clientUserId ?? userId },
      skip,
      take: limit,
      select: {
        description: true,
        rating: true,
        ratingGiverUser: { select: { name: true, lastName: true } },
      },
    });

    const count = await this.prisma.rating.count({
      where: { userRatedId: clientUserId ?? userId },
    });
    const pageCount = count / limit;
    return { data: ratings, count, pageCount };
  }

  async getSingleUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        lastName: true,
        categories: true,
        bio: true,
        email: true,
        phoneNumber: true,
        id: true,
        ratings: {
          take: 2,
          select: {
            description: true,
            rating: true,
            ratingGiverUser: {
              select: {
                name: true,
                lastName: true,
              },
            },
          },
        },
        role: true,
        jobsDone: {
          take: 2,
          select: {
            name: true,
            id: true,
            category: true,
            location: true,
            date: true,
            description: true,
            price: true,
            price_type: true,
          },
        },
        jobs: {
          take: 2,
          select: {
            id: true,
            name: true,
            location: true,
            date: true,
            category: true,
          },
        },
      },
    });

    const totalRatings =
      user.ratings.reduce((a, b) => a + b.rating, 0) / user.ratings.length;

    const totalJobsPosted = user.jobs.length;
    const totalJobsDone = user.jobsDone.length;

    const resp = {
      ...user,
      totalRatings,
      totalJobsPosted,
      totalJobsDone,
    };

    return checkIfExistsAndReturn(user, 'User not found', resp);
  }

  async getAllUsers(
    page: number,
    limit: number,
  ): Promise<{ data: User[]; count: number; pageCount: number }> {
    const skip = (page - 1) * limit;

    const users = await this.prisma.user.findMany({
      skip,
      take: limit,
    });

    const count = await this.prisma.user.count({});
    const pageCount = count / limit;
    return { data: users, count, pageCount };
  }

  async deleteUser(userId: number) {
    try {
      await this.prisma.user.delete({ where: { id: userId } });
      return { msg: 'User successfully deleted' };
    } catch (error) {
      return error;
    }
  }

  async editUser(userId: number, user: RegisterDto) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: user,
      });
      return updatedUser;
    } catch (error) {
      return error;
    }
  }

  async getAreaOfWork(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      return user.areaOfWork;
    } catch (error) {
      return error;
    }
  }

  async updateAreaOfWork(
    userId: number,
    areaOfWork: { lat: number; lng: number }[],
  ) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          areaOfWork,
        },
      });
      return user.areaOfWork;
    } catch (error) {
      return error;
    }
  }
}
