import { useCanvasSnapshotStore } from '../store/canvas-snapshot.store';
import { cleaningEvents } from '../utils/cleaning-events.util';
import { socket } from '../socket';
import { uploadPaint } from '../api/api.paint';

export const onEraser = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  const setUndo = useCanvasSnapshotStore.getState().setUndo;
  const clearReplace = useCanvasSnapshotStore.getState().clearReplace;
  let draw = false;

  cleaningEvents(canvas);

  canvas.onmousedown = () => {
    draw = true;
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    socket.emit('eraser_down', { line: ctx.lineWidth });
  };

  canvas.onmousemove = (e: MouseEvent) => {
    if (draw) {
      ctx.lineTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
      ctx.stroke();
      socket.emit('eraser_move', { x: e.pageX - canvas.offsetLeft, y: e.pageY - canvas.offsetTop });
    }
  };

  canvas.onmouseup = () => {
    draw = false;
    setUndo(ctx.getImageData(0, 0, canvas.width, canvas.height));
    clearReplace();
    socket.emit('eraser_up', { width: canvas.width, height: canvas.height });
    uploadPaint(canvas);
  };
};
