import { useCanvasSnapshotStore } from '../store/canvas-snapshot.store';
import { socket } from '../socket';

export const onUsersSquare = (ctx: CanvasRenderingContext2D) => {
  const setUndo = useCanvasSnapshotStore.getState().setUndo;
  const clearReplace = useCanvasSnapshotStore.getState().clearReplace;

  let isDrawing = false;
  let snapshot: ImageData;

  socket.on('on_square_down', ({ width, height, color,line }: { width: number; height: number,color:string; line:number }) => {
    isDrawing = true;
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.lineWidth = line
    ctx.beginPath();
    snapshot = ctx.getImageData(0, 0, width, height);
  });

  socket.on(
    'on_square_move',
    ({ prevX, prevY, x, y, filling }: { prevX: number; prevY: number; x: number; y: number; filling: boolean }) => {
      if (!snapshot || !isDrawing) return;
      ctx.putImageData(snapshot, 0, 0);
      if (filling) {
        ctx.fillRect(x, y, prevX - x, prevY - y);
      } else {
        ctx.strokeRect(x, y, prevX - x, prevY - y);
      }
    }
  );

  socket.on('on_square_up', ({ width, height }: { width: number; height: number }) => {
    isDrawing = false;
    setUndo(ctx.getImageData(0, 0, width, height));
    clearReplace();
  });
};
