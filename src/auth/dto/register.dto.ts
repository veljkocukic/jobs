import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: String,
    enum: Role,
    example: 'WORKER',
  })
  @IsString()
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  lastName?: string;

  @ApiProperty({
    type: String,
  })
  @IsPhoneNumber()
  phoneNumber: string;
}
