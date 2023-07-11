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

  async getSingleUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return checkIfExistsAndReturn(user, 'User not found');
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
}
