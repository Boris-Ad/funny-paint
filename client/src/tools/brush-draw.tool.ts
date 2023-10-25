import { useCanvasSnapshotStore } from '../store/canvas-snapshot.store';
import { cleaningEvents } from '../utils/cleaning-events.util';
import { socket } from '../socket';
import { uploadPaint } from '../api/api.paint';

export const onBrush = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  const setUndo = useCanvasSnapshotStore.getState().setUndo;
  const clearReplace = useCanvasSnapshotStore.getState().clearReplace;
  let draw = false;

  cleaningEvents(canvas);

  canvas.onmousedown = (e: MouseEvent) => {
    draw = true;
    ctx.beginPath();
    ctx.lineTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
    socket.emit('brush_down', {
      x: e.pageX - canvas.offsetLeft,
      y: e.pageY - canvas.offsetTop,
      color: ctx.strokeStyle,
      line: ctx.lineWidth,
    });
  };
  canvas.onmousemove = (e: MouseEvent) => {
    if (draw) {
      socket.emit('brush_move', { x: e.pageX - canvas.offsetLeft, y: e.pageY - canvas.offsetTop });
      ctx.lineTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
      ctx.stroke();
    }
  };

  canvas.onmouseup = () => {
    draw = false;
    socket.emit('brush_up', { width: canvas.width, height: canvas.height });
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndo(snapshot);
    uploadPaint(canvas);
    clearReplace();
  };
};
