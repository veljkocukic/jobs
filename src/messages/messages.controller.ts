import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { AddMessageDto } from './dto';

@ApiTags('Messages')
@UseGuards(JwtGuard)
@Controller('messages')
@ApiBearerAuth()
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get()
  getMessages(
    @Query('conversationId', ParseIntPipe) conversationId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.messagesService.getMessages(conversationId, page, limit);
  }

  @Post()
  addNewMessage(@Body() dto: AddMessageDto) {
    return this.messagesService.addNewMessage(dto);
  }
}
