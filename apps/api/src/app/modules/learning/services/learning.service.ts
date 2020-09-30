import { Injectable } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection } from '@nestjs/websockets';
import { Socket } from 'net';

@WebSocketGateway()
@Injectable()
export class LearningService implements OnGatewayConnection{

  client:Socket;
  constructor() {
  }
  handleConnection(client: any, ...args: any[]) {
    this.client = client;
  }

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket,): string {
    console.log('Received Data:', data);
    this.client = client;
    return data;
  }
}
