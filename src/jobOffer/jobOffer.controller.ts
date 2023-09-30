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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Job Offer')
@UseGuards(JwtGuard)
@Controller('job-offer')
@ApiBearerAuth()
export class JobOfferController {
  constructor(private jobOfferService: JobOfferService) {}

  @Get(':jobId')
  getSingleJobOffer(@Param('jobId', ParseIntPipe) jobId: number) {
    return this.jobOfferService.getSingleJobOffer(jobId);
  }

  @Get('all/:jobId')
  getJobOffers(
    @Param('jobId', ParseIntPipe) jobId: number,
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
  ) {
    return this.jobOfferService.getJobOffers(jobId, page, limit);
  }

  @Post(':jobId')
  createJobOffer(
    @GetUser('id', ParseIntPipe) userId: number,
    @Param('jobId', ParseIntPipe) jobId: number,
    @Body() dto: CreateJobOfferDto,
  ) {
    return this.jobOfferService.createJobOffer(userId, jobId, dto);
  }

  @Delete(':id')
  deleteJobOffer(@Param('id', ParseIntPipe) jobOfferId: number) {
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
