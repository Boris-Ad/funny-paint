import { useCanvasSnapshotStore } from '../store/canvas-snapshot.store';
import { socket } from '../socket';

export const onUsersTriangle = (ctx: CanvasRenderingContext2D) => {
  const setUndo = useCanvasSnapshotStore.getState().setUndo;
  const clearReplace = useCanvasSnapshotStore.getState().clearReplace;
  let isDrawing = false;
  let snapshot: ImageData;

  socket.on('on_triangle_down', ({ width, height, color,line }: { width: number; height: number; color:string;line:number }) => {
    isDrawing = true;
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.lineWidth = line
    ctx.beginPath();
    snapshot = ctx.getImageData(0, 0, width, height);
  });

  socket.on('on_triangle_move', ({ prevX, prevY, x, y, filling }: { prevX: number; prevY: number; x: number; y: number; filling: boolean }) => {
    if (!snapshot || !isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(x, y);
    ctx.lineTo(prevX * 2 - x, y);
    ctx.closePath();

    if (filling) {
      ctx.fill();
    } else {
      ctx.stroke();
    }
  });

  socket.on('on_triangle_up', ({ width, height }: { width: number; height: number }) => {
    isDrawing = false;
    setUndo(ctx.getImageData(0, 0, width, height));
    clearReplace();
  });
};
