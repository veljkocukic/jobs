import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategy';
import { JobOfferService } from './jobOffer.service';
import { JobOfferController } from './jobOffer.controller';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [JwtModule.register({}), EventsModule],
  providers: [JobOfferService, JwtStrategy],
  controllers: [JobOfferController],
})
export class JobOfferModule {}
