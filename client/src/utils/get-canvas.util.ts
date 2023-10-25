import type { Params } from 'react-router-dom';
import { getPaint } from '../api/api.paint';

export const getCanvas = async (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, params: Readonly<Params<string>>) => {
  if (!params.name) return;
  const paint = await getPaint(params.name);
  const img = new Image();
  img.onload = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
  img.src = paint;
};
