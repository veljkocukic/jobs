import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { JobModule } from './job/job.module';
import { JobOfferModule } from './jobOffer/jobOffer.module';
import { MessagesModule } from './messages/messages.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    JobModule,
    JobOfferModule,
    MessagesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    EventsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
