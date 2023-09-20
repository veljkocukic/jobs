import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { AddMessageDto } from './dto';
import { GetUser } from 'src/auth/decorator';

@ApiTags('Messages')
@UseGuards(JwtGuard)
@Controller('messages')
@ApiBearerAuth()
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get()
  getMessages(
    @Query('conversationId') conversationId: number,
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 20,
  ) {
    return this.messagesService.getMessages(conversationId, page, limit);
  }

  @Get('conversations')
  getConversations(@GetUser('id', ParseIntPipe) userId: number) {
    return this.messagesService.getConversations(userId);
  }

  @Get('goto-conversation/:receiverId')
  goToConversation(
    @GetUser('id', ParseIntPipe) senderId: number,
    @Param('receiverId', ParseIntPipe) receiverid: number,
  ) {
    return this.messagesService.goToConversation(senderId, receiverid);
  }

  @Post()
  addNewMessage(@Body() dto: AddMessageDto) {
    return this.messagesService.addNewMessage(dto);
  }
}
