import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUser } from './decorator';
import { AddBioAndCatDto, RegisterDto } from './dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('update-bio')
  addBioAndCategories(
    @Body() dto: AddBioAndCatDto,
    @GetUser('id', ParseIntPipe) userId: number,
  ) {
    return this.authService.addBioAndCategories(userId, dto);
  }
}
