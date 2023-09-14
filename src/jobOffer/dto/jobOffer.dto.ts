import { ApiProperty } from '@nestjs/swagger';
import { Currency, PriceType } from '@prisma/client';
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
    enum: PriceType,
    example: 'PER_DAY',
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
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  amount?: number;
}
