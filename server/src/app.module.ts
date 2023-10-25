import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SocketsModule } from './sockets/sockets.module';
import { PaintModule } from './paint/paint.module';



@Module({
  imports: [ConfigModule.forRoot(),SocketsModule, PaintModule],
})
export class AppModule {}
