import { ApiProperty } from '@nestjs/swagger';
import { JobType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class CoordinatesDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Latitude',
    type: Number,
  })
  lat: string;

  @ApiProperty({
    description: 'Longitude',
    type: Number,
  })
  @IsNotEmpty()
  lng: string;
}

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

  @ApiProperty({
    type: CoordinatesDto,
  })
  @ValidateNested()
  @Type(() => CoordinatesDto)
  areaOfWork: CoordinatesDto[];
}
