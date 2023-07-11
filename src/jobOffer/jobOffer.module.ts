import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategy';
import { JobOfferService } from './jobOffer.service';
import { JobOfferController } from './jobOffer.controller';

@Module({
  imports: [JwtModule.register({})],
  providers: [JobOfferService, JwtStrategy],
  controllers: [JobOfferController],
})
export class JobOfferModule {}
