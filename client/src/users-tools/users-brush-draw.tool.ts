import { useCanvasSnapshotStore } from '../store/canvas-snapshot.store';
import { socket } from '../socket';

export const onUsersBrush = (ctx: CanvasRenderingContext2D) => {
  const setUndo = useCanvasSnapshotStore.getState().setUndo;
  const clearReplace = useCanvasSnapshotStore.getState().clearReplace;
  let draw = false;

  socket.on('on_brush_down', ({ x, y, color, line }: { x: number; y: number; color: string; line: number }) => {
    draw = true;
    ctx.strokeStyle = color;
    ctx.lineWidth = line;
    ctx.beginPath();
    ctx.lineTo(x, y);
  });

  socket.on('on_brush_move', ({ x, y }: { x: number; y: number }) => {
    if (draw) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  });

  socket.on('on_brush_up', ({ width, height }: { width: number; height: number }) => {
    draw = false;
    setUndo(ctx.getImageData(0, 0, width, height));
    clearReplace();
  });
};
