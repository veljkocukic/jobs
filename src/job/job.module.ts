import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategy';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [JwtModule.register({}), EventsModule],
  providers: [JobService, JwtStrategy],
  controllers: [JobController],
})
export class JobModule {}
