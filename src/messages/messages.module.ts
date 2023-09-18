import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategy';
import { EventsModule } from 'src/events/events.module';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  imports: [JwtModule.register({}), EventsModule],
  providers: [MessagesService, JwtStrategy],
  controllers: [MessagesController],
})
export class MessagesModule {}
