import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketsService } from './sockets.service';

@WebSocketGateway({
  transport:["polling", "websocket"],
  cors: { origin: '*' },
})
export class ToolsGateway {
  constructor(private socketService: SocketsService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('brush_down')
  async brushDown(
    @MessageBody() { x, y, color, line }: { x: number; y: number; color: string; line: number },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.to(socket.data.paintName).emit('on_brush_down', { x, y, color, line });
  }

  @SubscribeMessage('brush_move')
  async brushMove(@MessageBody() { x, y }: { x: number; y: number }, @ConnectedSocket() socket: Socket) {
    socket.to(socket.data.paintName).emit('on_brush_move', { x, y });
  }

  @SubscribeMessage('brush_up')
  async brushUp(@MessageBody() { width, height }: { width: number; height: number }, @ConnectedSocket() socket: Socket) {
    socket.to(socket.data.paintName).emit('on_brush_up', { width, height });
  }

  @SubscribeMessage('circle_down')
  async circleDown(
    @MessageBody() { width, height, color, line }: { width: number; height: number; color: string; line: number },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.to(socket.data.paintName).emit('on_circle_down', { width, height, color, line });
  }

  @SubscribeMessage('circle_move')
  async circleMove(
    @MessageBody() { x, y, radius, filling }: { x: number; y: number; radius: number; filling: boolean },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.to(socket.data.paintName).emit('on_circle_move', { x, y, radius, filling });
  }

  @SubscribeMessage('circle_up')
  async circleUp(@MessageBody() { width, height }: { width: number; height: number }, @ConnectedSocket() socket: Socket) {
    socket.to(socket.data.paintName).emit('on_circle_up', { width, height });
  }

  @SubscribeMessage('line_down')
  async lineDown(
    @MessageBody() { width, height, color, line }: { width: number; height: number; color: string; line: number },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.to(socket.data.paintName).emit('on_line_down', { width, height, color, line });
  }

  @SubscribeMessage('line_move')
  async lineMove(
    @MessageBody() { prevX, prevY, x, y }: { prevX: number; prevY: number; x: number; y: number },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.to(socket.data.paintName).emit('on_line_move', { prevX, prevY, x, y });
  }

  @SubscribeMessage('line_up')
  async lineUp(@MessageBody() { width, height }: { width: number; height: number }, @ConnectedSocket() socket: Socket) {
    socket.to(socket.data.paintName).emit('on_line_up', { width, height });
  }

  @SubscribeMessage('square_down')
  async squareDown(
    @MessageBody() { width, height, color, line }: { width: number; height: number; color: string; line: number },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.to(socket.data.paintName).emit('on_square_down', { width, height, color, line });
  }

  @SubscribeMessage('square_move')
  async squareMove(
    @MessageBody() { prevX, prevY, x, y, filling }: { prevX: number; prevY: number; x: number; y: number; filling: boolean },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.to(socket.data.paintName).emit('on_square_move', { prevX, prevY, x, y, filling });
  }

  @SubscribeMessage('square_up')
  async squareUp(@MessageBody() { width, height }: { width: number; height: number }, @ConnectedSocket() socket: Socket) {
    socket.to(socket.data.paintName).emit('on_square_up', { width, height });
  }

  @SubscribeMessage('triangle_down')
  async triangleDown(
    @MessageBody() { width, height, color, line }: { width: number; height: number; color: string; line: number },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.to(socket.data.paintName).emit('on_triangle_down', { width, height, color, line });
  }

  @SubscribeMessage('triangle_move')
  async triangleMove(
    @MessageBody() { prevX, prevY, x, y, filling }: { prevX: number; prevY: number; x: number; y: number; filling: boolean },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.to(socket.data.paintName).emit('on_triangle_move', { prevX, prevY, x, y, filling });
  }

  @SubscribeMessage('triangle_up')
  async triangleUp(@MessageBody() { width, height }: { width: number; height: number }, @ConnectedSocket() socket: Socket) {
    socket.to(socket.data.paintName).emit('on_triangle_up', { width, height });
  }

  @SubscribeMessage('eraser_down')
  async eraserDown(@MessageBody() { line }: { line: number }, @ConnectedSocket() socket: Socket) {
    socket.to(socket.data.paintName).emit('on_eraser_down', { line });
  }

  @SubscribeMessage('eraser_move')
  async eraserMove(@MessageBody() { x, y }: { x: number; y: number }, @ConnectedSocket() socket: Socket) {
    socket.to(socket.data.paintName).emit('on_eraser_move', { x, y });
  }

  @SubscribeMessage('eraser_up')
  async eraserUp(@MessageBody() { width, height }: { width: number; height: number }, @ConnectedSocket() socket: Socket) {
    socket.to(socket.data.paintName).emit('on_eraser_up', { width, height });
  }

  @SubscribeMessage('clear_paint')
  async clearPaint(@ConnectedSocket() socket: Socket) {
    socket.to(socket.data.paintName).emit('on_clear_paint');
  }

  @SubscribeMessage('set_undo')
  async setUndo(@ConnectedSocket() socket: Socket) {
    socket.to(socket.data.paintName).emit('on_set_undo');
  }

  @SubscribeMessage('set_replace')
  async setReplace(@ConnectedSocket() socket: Socket) {
    socket.to(socket.data.paintName).emit('on_set_replace');
  }
}
