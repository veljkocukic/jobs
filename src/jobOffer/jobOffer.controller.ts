import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
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
  getSingleJobOffer(@Param('jobId', ParseIntPipe) jobOfferId: number) {
    return this.jobOfferService.getSingleJobOffer(jobOfferId);
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
