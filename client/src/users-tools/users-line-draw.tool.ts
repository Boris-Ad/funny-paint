import { useCanvasSnapshotStore } from '../store/canvas-snapshot.store';
import { socket } from '../socket';

export const onUsersLine = (ctx: CanvasRenderingContext2D) => {
  const setUndo = useCanvasSnapshotStore.getState().setUndo;
  const clearReplace = useCanvasSnapshotStore.getState().clearReplace;

  let isDrawing = false;
  let snapshot: ImageData;

  socket.on('on_line_down', ({ width, height, color,line }: { width: number; height: number; color: string; line:number }) => {
    isDrawing = true;
    ctx.strokeStyle = color;
    ctx.lineWidth = line
    ctx.beginPath();
    snapshot = ctx.getImageData(0, 0, width, height);
    ctx.getImageData(0, 0, width, height);
  });

  socket.on('on_line_move', ({ prevX, prevY, x, y }: { prevX: number; prevY: number; x: number; y: number }) => {
    if (!snapshot || !isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(x, y);
    ctx.stroke();
  });

  socket.on('on_line_up', ({ width, height }: { width: number; height: number }) => {
    isDrawing = false;
    setUndo(ctx.getImageData(0, 0, width, height));
    clearReplace();
  });
};
