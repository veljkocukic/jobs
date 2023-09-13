import { ApiProperty } from '@nestjs/swagger';
import { JobType } from '@prisma/client';
import { IsArray, IsString } from 'class-validator';

export class AddBioAndCatDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  bio: string;

  @ApiProperty({
    type: Array,
    isArray: true,
    enum: JobType,
  })
  @IsArray()
  categories: JobType[];
}
