import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketsService } from './sockets.service';

@WebSocketGateway({
  transport:["polling", "websocket"],
  cors: { origin: '*' },
 
})
export class SocketsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private socketService: SocketsService) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    await this.socketService.connection(this.server, socket);
    await this.socketService.getActiveRooms(this.server);
  }

  async handleDisconnect(socket: Socket) {
    await this.socketService.getActiveRooms(this.server);
    await this.socketService.getUsersInRoom(this.server, socket.data.paintName);
  }

  @SubscribeMessage('create_room')
  async createRoom(@MessageBody() body: { paintName: string }, @ConnectedSocket() socket: Socket) {
    socket.join(body.paintName);
    socket.data = { ...body, socketId: socket.id };
    await this.socketService.getActiveRooms(this.server);
    await this.socketService.getUsersInRoom(this.server, body.paintName);
    return socket.data;
  }

  @SubscribeMessage('join_room')
  async joinChat(@MessageBody() body: { paintName: string; userName: string }, @ConnectedSocket() socket: Socket) {
    await this.socketService.joinRoom(this.server, socket, body);
    await this.socketService.getUsersInRoom(this.server, body.paintName);
    return socket.data;
  }

  @SubscribeMessage('remove_room')
  async removeRoom(@MessageBody() paintRoom: string, @ConnectedSocket() socket: Socket) {
    await this.socketService.removeRoom(this.server, socket, paintRoom);
    await this.socketService.getActiveRooms(this.server);
  }

  @SubscribeMessage('leave_room')
  async leaveRoom(@MessageBody() paintName: string, @ConnectedSocket() socket: Socket) {
    await this.socketService.leaveRoom(this.server, socket, paintName);
    await this.socketService.getUsersInRoom(this.server, paintName);
  }

  @SubscribeMessage('send_message')
  async sendMessage(@MessageBody() message: string, @ConnectedSocket() socket: Socket) {
    await this.socketService.sendMessage(this.server, socket, message);
    return 'ok';
  }
}
