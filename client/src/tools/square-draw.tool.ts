import { useCanvasSnapshotStore } from '../store/canvas-snapshot.store';
import { useFillingStore } from '../store/filling.store';
import { cleaningEvents } from '../utils/cleaning-events.util';
import { socket } from '../socket';
import { uploadPaint } from '../api/api.paint';

export const onSquare = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
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
    socket.emit('square_down', { width: canvas.width, height: canvas.height,color:ctx.strokeStyle,line:ctx.lineWidth });
  };

  canvas.onmousemove = (e: MouseEvent) => {
    const filling = useFillingStore.getState().filling;
    if (!snapshot || !isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);
    if (filling) {
      ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    } else {
      ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    socket.emit('square_move', { prevX: prevMouseX, prevY: prevMouseY,x:e.offsetX,y:e.offsetY, filling });
  };

  canvas.onmouseup = () => {
    isDrawing = false;
    setUndo(ctx.getImageData(0, 0, canvas.width, canvas.height));
    clearReplace()
    socket.emit('square_up', { width: canvas.width, height: canvas.height });
    uploadPaint(canvas);
  };
};
