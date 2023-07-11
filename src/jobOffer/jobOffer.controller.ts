import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { JobOfferService } from './jobOffer.service';
import { CreateJobOfferDto } from './dto';

@UseGuards(JwtGuard)
@Controller('job-offer')
export class JobOfferController {
  constructor(private jobOfferService: JobOfferService) {}

  @Get(':id')
  getSingleJobOffer(@Query('jobId', ParseIntPipe) jobOfferId: number) {
    return this.jobOfferService.getSingleJobOffer(jobOfferId);
  }

  @Post()
  createJob(
    @GetUser('id', ParseIntPipe) userId: number,
    @Query('jobId', ParseIntPipe) jobId: number,
    @Body() dto: CreateJobOfferDto,
  ) {
    return this.jobOfferService.createJobOffer(userId, jobId, dto);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) jobOfferId: number) {
    return this.jobOfferService.deleteJobOffer(jobOfferId);
  }

  @Post('accept/:jobOfferId')
  acceptJobOffer(
    @GetUser('id') userId: number,
    @Param('jobOfferId', ParseIntPipe) jobOfferId: number,
  ) {
    return this.jobOfferService.acceptJobOffer(jobOfferId, userId);
  }
}
