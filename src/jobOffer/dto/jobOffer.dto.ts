import { Currency, PriceType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateJobOfferDto {
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
  @IsNumber()
  amount?: number;
}
