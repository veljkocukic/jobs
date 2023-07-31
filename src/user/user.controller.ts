import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { RegisterDto } from 'src/auth/dto';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get(':id')
  getSingleUser(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.getSingleUser(userId);
  }

  @Get()
  getAllUsers(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
  ) {
    return this.userService.getAllUsers(page, limit);
  }

  @Patch(':id')
  editUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body() userData: RegisterDto,
  ) {
    return this.userService.editUser(userId, userData);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.deleteUser(userId);
  }

  @Get('ratings/:id')
  getUserRatings(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @GetUser('id', ParseIntPipe) userId: number,
  ) {
    return this.userService.getUserRatings(page, limit, userId);
  }
}
