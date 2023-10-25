import { Injectable, BadGatewayException } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile, readFile, existsSync, remove } from 'fs-extra';

@Injectable()
export class PaintService {
  
  async getPaint(name: string) {
    const canvas = path + '/uploads/' + name + '.txt';
    if (existsSync(canvas)) {
      const file = await readFile(canvas, 'utf-8');
      return file;
    }
  }

  async uploadPaint({ canvas, paintName }: { canvas: string; paintName: string }) {
    const uploadFolder = path + '/uploads/';
    await ensureDir(uploadFolder);
    await writeFile(uploadFolder + paintName + '.txt', canvas);
  }

  async deletePaint(name: string) {
    const canvas = path + '/uploads/' + name + '.txt';
    if (existsSync(canvas)) {
      await remove(canvas);
    }
  }

  async deleteDirPaint() {
    const dir = path + '/uploads/';
    if (existsSync(dir)) {
      await remove(dir);
    }
  }
}
