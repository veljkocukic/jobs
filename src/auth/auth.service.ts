import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddBioAndCatDto, LoginDto, RegisterDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async register(dto: RegisterDto) {
    try {
      const hash = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: { ...dto, password: hash },
      });
      delete user.password;
      const token = await this.signToken(user.id, user.email);
      return { ...token, user };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Data already in use');
      }
      return error;
    }
  }
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Pogrešna mejl adresa.');

    const pwMatches = await argon.verify(user.password, dto.password);

    if (!pwMatches) throw new ForbiddenException('Pogrešna lozinka');
    delete user.password;
    const token = await this.signToken(user.id, user.email);
    return { ...token, user };
  }
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      secret,
    });

    return {
      access_token: token,
    };
  }

  async addBioAndCategories(userId: number, dto: AddBioAndCatDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        bio: dto.bio,
        categories: dto.categories,
        areaOfWork: dto.areaOfWork as any,
      },
    });
    return user;
  }
}
