import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CompleteAndRateDTO {
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @ApiProperty({
    type: String,
    example: 'Dobar radnik',
  })
  @IsString()
  description?: string;
}
