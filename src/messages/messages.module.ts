import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategy';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [MessagesService, JwtStrategy],
  controllers: [MessagesController],
})
export class MessagesModule {}
