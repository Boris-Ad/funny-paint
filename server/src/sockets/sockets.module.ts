import { Module } from '@nestjs/common';
import { SocketsGateway } from './sockets.gateway';
import { SocketsService } from './sockets.service';
import { ToolsGateway } from './tools.gateway';
import { PaintModule } from 'src/paint/paint.module';

@Module({
  imports: [PaintModule],
  providers: [SocketsGateway, SocketsService, ToolsGateway],
})
export class SocketsModule {}
