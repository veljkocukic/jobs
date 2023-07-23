import { JobType } from '@prisma/client';
import { IsString } from 'class-validator';

export class AddBioAndCatDto {
  @IsString()
  bio: string;

  @IsString()
  categories: JobType[];
}
