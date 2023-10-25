export function cleaningEvents(canvas: HTMLCanvasElement) {
  canvas.onmousedown = null;
  canvas.onmouseup = null;
  canvas.onmousemove = null;
}
