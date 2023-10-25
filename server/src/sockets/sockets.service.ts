import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { PaintService } from 'src/paint/paint.service';

@Injectable()
export class SocketsService {
  constructor(private paintService: PaintService) {}

  async connection(server: Server, socket: Socket) {
    socket.on('disconnecting', () => {
      server.to(socket.data.paintName).emit('new_message', { userName: socket.data.userName, message: 'Покинул paint' });
      if (socket.data?.userStatus === 'admin') {
        this.paintService.deletePaint(socket.data.paintName);
        server.to(socket.data.paintName).emit('new_message', { userName: socket.data.userName, message: 'Paint закрыт!' });
        server.to(socket.data.paintName).emit('room_close');
        server.socketsLeave(socket.data.paintName);
      }
    });
  }

  async sendMessage(server: Server, socket: Socket, message: string) {
    server.to(socket.data.paintName).emit('new_message', { userName: socket.data.userName, message });
  }

  async getActiveRooms(server: Server) {
    const rooms = [];
    const sockets = await server.fetchSockets();
    sockets.forEach((socket) => {
      for (let room of socket.rooms.values()) {
        if (socket.id !== room && socket.data.userStatus === 'admin') {
          rooms.push(socket.data);
        }
      }
    });
    if(rooms.length === 0){
      this.paintService.deleteDirPaint()
    }
    
    server.emit('existing_rooms', rooms);
  }

  async removeRoom(server: Server, socket: Socket, paintRoom: string) {
    server.to(socket.data.paintName).emit('new_message', { userName: socket.data.userName, message: 'Paint закрыт!' });
    server.to(socket.data.paintName).emit('room_close');
    server.socketsLeave(paintRoom);
    socket.data = {};
  }

  async joinRoom(server: Server, socket: Socket, body: { paintName: string }) {
    socket.data = { ...body, socketId: socket.id };
    socket.join(body.paintName);
    server.to(socket.data.paintName).emit('new_message', { userName: socket.data.userName, message: 'Присоединился к paint' });
  }

  async leaveRoom(server: Server, socket: Socket, paintRoom: string) {
    server.to(socket.data.paintName).emit('new_message', { userName: socket.data.userName, message: 'Покинул paint' });
    socket.leave(paintRoom);
  }

  async getUsersInRoom(server: Server, paintName: string) {
    const usersFromRoom = await server.in(paintName).fetchSockets();
    const users = usersFromRoom.map((user) => user.data.userName);
    server.to(paintName).emit('users_from_room', users);
  }
}
