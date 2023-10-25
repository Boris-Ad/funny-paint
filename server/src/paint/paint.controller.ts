import { Body, Controller, Get, Post, Delete, Param, Query } from '@nestjs/common';
import { PaintService } from './paint.service';

@Controller('api/paint')
export class PaintController {
  constructor(private paintService: PaintService) {}

  @Get('/:name')
  async getPaint(@Param('name') name: string) {
    return this.paintService.getPaint(name);
  }

  @Post()
  async uploadPaint(@Body() body: any) {
    return this.paintService.uploadPaint(body);
  }

  @Delete('/:name')
  async deletePaint(@Param('name') name: string) {
    return this.paintService.deletePaint(name);
  }
}
// { canvas: string; paintName: string }
