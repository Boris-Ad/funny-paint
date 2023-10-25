import { useCanvasSnapshotStore } from '../store/canvas-snapshot.store';
import { socket } from '../socket';

export const onUsersEraser = (ctx: CanvasRenderingContext2D) => {
  const setUndo = useCanvasSnapshotStore.getState().setUndo;
  const clearReplace = useCanvasSnapshotStore.getState().clearReplace;
  let draw = false;

  socket.on('on_eraser_down', ({ line }: { line: number }) => {
    draw = true;
    ctx.lineWidth = line;
    ctx.beginPath();
    ctx.strokeStyle = 'white';
  });

  socket.on('on_eraser_move', ({ x, y }: { x: number; y: number }) => {
    if (draw) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  });

  socket.on('on_eraser_up', ({ width, height }: { width: number; height: number }) => {
    draw = false;
    setUndo(ctx.getImageData(0, 0, width, height));
    clearReplace();
  });
};
