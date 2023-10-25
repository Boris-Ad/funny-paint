import { useCanvasSnapshotStore } from '../store/canvas-snapshot.store';
import { useFillingStore } from '../store/filling.store';
import { cleaningEvents } from '../utils/cleaning-events.util';
import { socket } from '../socket';
import { uploadPaint } from '../api/api.paint';

export const onCircle = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
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
    socket.emit('circle_down', { width: canvas.width, height: canvas.height, color: ctx.strokeStyle,line: ctx.lineWidth });
  };

  canvas.onmousemove = (e: MouseEvent) => {
    const filling = useFillingStore.getState().filling;
    let radius = Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2));
    if (!snapshot || !isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);
    ctx.beginPath();
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    socket.emit('circle_move', { x: prevMouseX, y: prevMouseY, radius, filling });

    if (filling) {
      ctx.fill();
    } else {
      ctx.stroke();
    }
  };

  canvas.onmouseup = () => {
    isDrawing = false;
    setUndo(ctx.getImageData(0, 0, canvas.width, canvas.height));
    clearReplace();
    socket.emit('circle_up', { width: canvas.width, height: canvas.height });
    uploadPaint(canvas);
  };
};
