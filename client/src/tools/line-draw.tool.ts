import { useCanvasSnapshotStore } from '../store/canvas-snapshot.store';
import { cleaningEvents } from '../utils/cleaning-events.util';
import { socket } from '../socket';
import { uploadPaint } from '../api/api.paint';

export const onLine = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  const setUndo = useCanvasSnapshotStore.getState().setUndo;
  const clearReplace = useCanvasSnapshotStore.getState().clearReplace;
  cleaningEvents(canvas);

  let isDrawing = false;
  let prevMouseX = 0;
  let prevMouseY = 0;
  let snapshot: ImageData;

  canvas.onmousedown = (e: MouseEvent) => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();

    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.getImageData(0, 0, canvas.width, canvas.height);
    socket.emit('line_down', { width: canvas.width, height: canvas.height, color: ctx.strokeStyle, line: ctx.lineWidth });
  };

  canvas.onmousemove = (e: MouseEvent) => {
    if (!snapshot || !isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    socket.emit('line_move', { prevX: prevMouseX, prevY: prevMouseY, x: e.offsetX, y: e.offsetY });
  };

  canvas.onmouseup = () => {
    isDrawing = false;

    setUndo(ctx.getImageData(0, 0, canvas.width, canvas.height));
    clearReplace();
    socket.emit('line_up', { width: canvas.width, height: canvas.height });
    uploadPaint(canvas);
  };
};
