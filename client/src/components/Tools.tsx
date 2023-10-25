import clsx from 'clsx';
import {
  IoArrowBackCircleOutline,
  IoArrowForwardCircleOutline,
  IoBrush,
  IoEllipseOutline,
  IoRemove,
  IoSquareOutline,
  IoTriangleOutline,
} from 'react-icons/io5';
import { socket } from '../socket';
import { PiEraserDuotone } from 'react-icons/pi';
import Colors from './Colors';
import { useCanvasStore } from '../store/canvas.store';
import React from 'react';
import { onBrush } from '../tools/brush-draw.tool';
import FillingColorCheckbox from './ui/FillingColorCheckbox';
import { saveImage } from '../utils/save-img.util';
import LineWidthInput from './ui/LineWidthInput';
import { onCircle } from '../tools/circle-draw.tool';
import { ToolsChecked } from '../types/tools.type';
import { onSquare } from '../tools/square-draw.tool';
import { onTriangle } from '../tools/triangle-draw.tool';
import { onLine } from '../tools/line-draw.tool';
import { onEraser } from '../tools/eraser-draw.tool';
import Tooltip from './ui/Tooltip';
import { useCanvasSnapshotStore } from '../store/canvas-snapshot.store';
import { onUsersBrush } from '../users-tools/users-brush-draw.tool';
import { onUsersCircle } from '../users-tools/users-circle-draw.tool';
import { onUsersLine } from '../users-tools/users-line-draw.tool';
import { onUsersSquare } from '../users-tools/users-square-draw.tool';
import { onUsersTriangle } from '../users-tools/users-triangle-draw.tool';
import { onUsersEraser } from '../users-tools/users-eraser-draw.tool';

const Tools: React.FC = () => {
  const [canvas, ctx] = useCanvasStore(state => [state.canvas, state.context]);
  const [activeTool, setActiveTool] = React.useState<ToolsChecked>();
  const [undo, setUndo] = useCanvasSnapshotStore(state => [state.undo, state.setUndo]);
  const [replace, setReplace] = useCanvasSnapshotStore(state => [state.replace, state.setReplace]);
  const clearSnapshot = useCanvasSnapshotStore(state => state.clearSnapshot);

  const forms = [
    { id: 1, title: ToolsChecked.SQUARE, icon: <IoSquareOutline className={'w-7 h-7'} />, foo: square },
    { id: 2, title: ToolsChecked.CIRCLE, icon: <IoEllipseOutline className={'w-7 h-7'} />, foo: circle },
    { id: 3, title: ToolsChecked.TRIANGLE, icon: <IoTriangleOutline className={'w-7 h-7'} />, foo: triangle },
    { id: 4, title: ToolsChecked.LINE, icon: <IoRemove className={'w-7 h-7'} />, foo: line },
  ];

  const tools = [
    { id: 1, title: ToolsChecked.BRUSH, icon: <IoBrush className={'w-7 h-7'} />, foo: brush },
    { id: 2, title: ToolsChecked.ERASER, icon: <PiEraserDuotone className={'w-7 h-7'} />, foo: eraser },
  ];

  function square() {
    if (!ctx || !canvas) return;
    setActiveTool(ToolsChecked.SQUARE);
    onSquare(canvas, ctx);
    onUsersSquare(ctx);
  }

  function triangle() {
    if (!ctx || !canvas) return;
    setActiveTool(ToolsChecked.TRIANGLE);
    onTriangle(canvas, ctx);
    onUsersTriangle(ctx);
  }
  function circle() {
    if (!ctx || !canvas) return;
    setActiveTool(ToolsChecked.CIRCLE);
    onCircle(canvas, ctx);
    onUsersCircle(ctx);
  }
  function line() {
    if (!ctx || !canvas) return;
    setActiveTool(ToolsChecked.LINE);
    onLine(canvas, ctx);
    onUsersLine(ctx);
  }
  function brush() {
    if (!ctx || !canvas) return;
    setActiveTool(ToolsChecked.BRUSH);
    onBrush(canvas, ctx);
    onUsersBrush(ctx);
  }
  function eraser() {
    if (!ctx || !canvas) return;
    setActiveTool(ToolsChecked.ERASER);
    onEraser(canvas, ctx);
    onUsersEraser(ctx);
  }

  React.useEffect(() => {
    square();
    triangle();
    circle();
    line();
    eraser();
    brush();
  }, [ctx]);

  const clearPaint = () => {
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      clearSnapshot();
      socket.emit('clear_paint');
    }
  };

  const onSetUndo = () => {
    if (!ctx) return;
    if (undo.length > 1) {
      const snapshot = undo.pop();
      const lastImage = undo[undo.length - 1];
      if (snapshot) {
        socket.emit('set_undo');
        ctx.putImageData(lastImage, 0, 0);
        setReplace(snapshot);
      }
    }
  };

  const onSetReplace = () => {
    if (!ctx) return;

    if (replace.length >= 1) {
      const lastImage = replace[replace.length - 1];
      const snapshot = replace.pop();
      if (snapshot) {
        socket.emit('set_replace');
        setUndo(snapshot);
        ctx.putImageData(lastImage, 0, 0);
      }
    }
  };

  React.useEffect(() => {
    socket.on('on_clear_paint', () => {
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        clearSnapshot();
      }
    });

    return () => {
      socket.off('on_clear_paint');
    };
  }, [ctx]);

  React.useEffect(() => {
    socket.on('on_set_undo', () => {
      if (!ctx) return;
      if (undo.length > 1) {
        const snapshot = undo.pop();
        const lastImage = undo[undo.length - 1];
        if (snapshot) {
          ctx.putImageData(lastImage, 0, 0);
          setReplace(snapshot);
        }
      }
    });
    socket.on('on_set_replace', () => {
      if (!ctx) return;
      if (replace.length >= 1) {
        const lastImage = replace[replace.length - 1];
        const snapshot = replace.pop();
        if (snapshot) {
          setUndo(snapshot);
          ctx.putImageData(lastImage, 0, 0);
        }
      }
    });
    return () => {
      socket.off('on_set_undo');
      socket.off('on_set_replace');
    };
  }, [ctx, undo, replace]);

  return (
    <section className="w-[250px] bg-white rounded-md p-4 flex flex-col">
      <div className="flex-1">
        <h3 className="text-xl font-medium">Формы</h3>
        <div className="text-slate-700 my-5">
          <ul className=" space-y-3 w-full">
            {forms.map(form => (
              <li
                key={form.id}
                onClick={form.foo}
                className={clsx(
                  'flex items-center gap-3 cursor-pointer',
                  activeTool === form.title ? 'text-orange-600' : 'hover:text-blue-500'
                )}
              >
                {form.icon}
                <span className="text-lg">{form.title}</span>
              </li>
            ))}
          </ul>
          <FillingColorCheckbox />
        </div>

        <h3 className="text-xl font-medium">Инструменты</h3>

        <ul className="text-slate-600 space-y-3 my-5 w-full">
          {tools.map(tool => (
            <li
              key={tool.id}
              onClick={tool.foo}
              className={clsx(
                'flex items-center gap-3 cursor-pointer',
                activeTool === tool.title ? 'text-orange-600' : 'hover:text-blue-500'
              )}
            >
              {tool.icon}
              <span className="text-lg">{tool.title}</span>
            </li>
          ))}
        </ul>

        <LineWidthInput ctx={ctx} />
        <h3 className="text-xl font-medium">Цвета</h3>
        <Colors ctx={ctx} />

        <button
          onClick={clearPaint}
          className="w-full py-2 my-2 border border-slate-300 rounded cursor-pointer
       hover:border-sky-500 active:ring active:ring-primary-200 active:text-slate-500"
        >
          Очистить холст
        </button>

        <button
          onClick={() => saveImage(canvas)}
          className="w-full block text-center py-2  border border-slate-300 rounded cursor-pointer bg-blue-500 text-slate-200
       hover:border-sky-400 hover:bg-blue-700 active:ring active:ring-primary-200"
        >
          Сохранить рисунок
        </button>
      </div>
      <div className="flex justify-between items-center text-slate-600">
        <button
          onClick={onSetUndo}
          disabled={Boolean(undo.length <= 1)}
          className="hover:scale-110 transition-all relative group active:text-orange-400 disabled:invisible"
        >
          <IoArrowBackCircleOutline className={'w-8 h-8'} />
          <Tooltip place="right">Отменить действие</Tooltip>
        </button>
        <button
          onClick={onSetReplace}
          disabled={Boolean(replace.length === 0)}
          className="hover:scale-110 transition-all relative group active:text-orange-400 disabled:invisible"
        >
          <IoArrowForwardCircleOutline className={'w-8 h-8'} />
          <Tooltip>Вернуть</Tooltip>
        </button>
      </div>
    </section>
  );
};
export default Tools;
// replace
