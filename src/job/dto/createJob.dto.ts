import { JobType, Currency, PriceType, JobStatus } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateJobDto {
  @IsEnum(JobType)
  @IsNotEmpty()
  type: JobType;

  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsEnum(Currency)
  @IsNotEmpty()
  currency: Currency;

  @IsNotEmpty()
  @IsEnum(PriceType)
  priceType: PriceType;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsBoolean()
  withoutMonitoring: boolean;
}
