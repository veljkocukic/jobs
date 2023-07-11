import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { JobModule } from './job/job.module';
import { JobOfferModule } from './jobOffer/jobOffer.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    JobModule,
    JobOfferModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
