import { ApiProperty } from '@nestjs/swagger';
import { JobType, Currency, price_type } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class LocationDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Description',
    type: String,
    minLength: 1,
  })
  label: string;

  @ApiProperty({
    description: 'place_id',
    type: String,
    minLength: 1,
  })
  @IsNotEmpty()
  value: string;

  @ApiProperty({
    description: 'Latitude',
    type: Number,
    minLength: 1,
  })
  @IsNotEmpty()
  lat: number;

  @ApiProperty({
    description: 'Longitude',
    type: Number,
    minLength: 1,
  })
  @IsNotEmpty()
  lng: number;
}

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
    enum: price_type,
  })
  @IsNotEmpty()
  @IsEnum(price_type)
  price_type: price_type;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    type: LocationDto,
  })
  @ValidateNested()
  @Type(() => LocationDto)
  location: {
    label: string;
    value: string;
    lng: number;
    lat: number;
  };

  @ApiProperty({
    type: Boolean,
  })
  @IsBoolean()
  withoutMonitoring: boolean;
}
