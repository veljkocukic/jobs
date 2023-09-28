import { ApiProperty } from '@nestjs/swagger';
import { Currency, price_type } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateJobOfferDto {
  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    type: String,
    enum: Currency,
    example: 'RSD',
  })
  @IsEnum(Currency)
  @IsNotEmpty()
  currency: Currency;

  @ApiProperty({
    type: String,
    enum: price_type,
    example: 'PER_DAY',
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
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  amount?: number;
}
