import { JobType } from '@prisma/client';
import { IsArray, IsString } from 'class-validator';

export class AddBioAndCatDto {
  @IsString()
  bio: string;

  @IsArray()
  categories: JobType[];
}
