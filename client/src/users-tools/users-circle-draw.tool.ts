import { useCanvasSnapshotStore } from '../store/canvas-snapshot.store';
import { socket } from '../socket';

export const onUsersCircle = (ctx: CanvasRenderingContext2D) => {
  const setUndo = useCanvasSnapshotStore.getState().setUndo;
  const clearReplace = useCanvasSnapshotStore.getState().clearReplace;
  let isDrawing = false;
  let snapshot: ImageData;

  socket.on(
    'on_circle_down',
    ({ width, height, color, line }: { width: number; height: number; color: string; line: number }) => {
      isDrawing = true;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = line;
      ctx.beginPath();
      snapshot = ctx.getImageData(0, 0, width, height);
    }
  );

  socket.on('on_circle_move', ({ x, y, radius, filling }: { x: number; y: number; radius: number; filling: boolean }) => {
    if (!snapshot || !isDrawing) return;

    ctx.putImageData(snapshot, 0, 0);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);

    if (filling) {
      ctx.fill();
    } else {
      ctx.stroke();
    }
  });

  socket.on('on_circle_up', ({ width, height }: { width: number; height: number }) => {
    isDrawing = false;
    setUndo(ctx.getImageData(0, 0, width, height));
    clearReplace();
  });
};
