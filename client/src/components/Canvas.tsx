import React from 'react';
import { useParams } from 'react-router-dom';
import { defaultSetting } from '../utils/default-setting.util';
import { cleaningEvents } from '../utils/cleaning-events.util';
import { useCanvasStore } from '../store/canvas.store';
import { getCanvas } from '../utils/get-canvas.util';

const Canvas: React.FC = () => {
  const params = useParams();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [setCanvas, setContext] = useCanvasStore(state => [state.setCanvas, state.setContext]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (canvas && ctx) {
      setCanvas(canvas);
      setContext(ctx);
      defaultSetting(canvas, ctx);
      getCanvas(canvas, ctx, params);
    }
    return () => {
      if (canvas) {
        cleaningEvents(canvas);
      }
    };
  }, []);

  return (
    <section className=" bg-white rounded-md p-2 flex-1">
      <canvas ref={canvasRef} className="w-full h-full border rounded bg-white" />
    </section>
  );
};

export default Canvas;
