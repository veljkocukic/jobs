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
import { CompleteAndRateDTO } from './dto/completeAndRate.dto';
import { CreateJobDto } from './dto/createJob.dto';
import { JobService } from './job.service';

@UseGuards(JwtGuard)
@Controller('jobs')
export class JobController {
  constructor(private jobService: JobService) {}

  @Get('worker-available-jobs')
  getAvailableWorkerJobs(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @GetUser('id', ParseIntPipe) userId: number,
  ) {
    return this.jobService.getAvailableWorkerJobs(page, limit, userId);
  }

  @Post()
  createJob(
    @GetUser('id', ParseIntPipe) userId: number,
    @Body() dto: CreateJobDto,
  ) {
    return this.jobService.createJob(userId, dto);
  }

  @Post('rate-and-complete/:id')
  completeJob(
    @GetUser('id', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) jobId: number,
    @Body() dto: CompleteAndRateDTO,
  ) {
    return this.jobService.completeAndRate(userId, jobId, dto);
  }

  @Get(':id')
  getSingleJob(@Param('id', ParseIntPipe) jobId: number) {
    return this.jobService.getSingleJob(jobId);
  }

  @Get()
  getAllJobs(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @GetUser('id', ParseIntPipe) userId: number,
  ) {
    return this.jobService.getAllJobs(page, limit, userId);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) jobId: number) {
    return this.jobService.deleteJob(jobId);
  }
}
