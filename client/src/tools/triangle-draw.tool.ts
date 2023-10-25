import { useCanvasSnapshotStore } from '../store/canvas-snapshot.store';
import { useFillingStore } from '../store/filling.store';
import { cleaningEvents } from '../utils/cleaning-events.util';
import { socket } from '../socket';
import { uploadPaint } from '../api/api.paint';

export const onTriangle = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
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
    socket.emit('triangle_down', { width: canvas.width, height: canvas.height,color:ctx.strokeStyle,line:ctx.lineWidth });
  };

  canvas.onmousemove = (e: MouseEvent) => {
    const filling = useFillingStore.getState().filling;
    if (!snapshot || !isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    socket.emit('triangle_move', { prevX: prevMouseX, prevY: prevMouseY,x:e.offsetX,y:e.offsetY, filling });
    if (filling) {
        ctx.fill();
      } else {
        ctx.stroke();
      }
    };
  
    canvas.onmouseup = () => {
      isDrawing = false;
      setUndo(ctx.getImageData(0, 0, canvas.width, canvas.height));
      clearReplace()
      socket.emit('triangle_up', { width: canvas.width, height: canvas.height });
      uploadPaint(canvas);
    };
  };

     
      