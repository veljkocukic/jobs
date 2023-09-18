import { Injectable, Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  //   afterInit(client: Socket) {
  //     client.use(SocketAuthMiddleware(this.configService) as any); // because types are broken
  //     Logger.log('afterInit');
  //   }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() payload: string): string {
    Logger.log('request', payload);
    return `ack: ${payload}`;
  }

  @SubscribeMessage('job')
  handleJob(@MessageBody() payload: any) {
    return payload;
  }

  sendNewMessage(message: any) {
    this.server.emit('message', message);
  }
}
