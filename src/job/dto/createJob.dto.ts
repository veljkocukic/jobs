import { ApiProperty } from '@nestjs/swagger';
import { JobType, Currency, PriceType } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateJobDto {
  @ApiProperty({
    type: String,
    example: 'Stefan',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    enum: JobType,
  })
  @IsEnum(JobType)
  @IsNotEmpty()
  category: JobType;

  @ApiProperty({
    type: Date,
  })
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    type: Number,
    enum: Currency,
  })
  @IsEnum(Currency)
  @IsNotEmpty()
  currency: Currency;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty({
    type: String,
    enum: PriceType,
  })
  @IsNotEmpty()
  @IsEnum(PriceType)
  priceType: PriceType;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({
    type: Boolean,
  })
  @IsBoolean()
  withoutMonitoring: boolean;
}
