export function saveImage(canvas: HTMLCanvasElement | null) {
  if (canvas) {
    const link = document.createElement('a');
    link.download = Date.now() + '.jpg';
    link.href = canvas.toDataURL();
    link.click();
    link.remove()
  }
}
