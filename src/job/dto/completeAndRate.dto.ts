import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CompleteAndRateDTO {
  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @IsString()
  description?: string;
}
