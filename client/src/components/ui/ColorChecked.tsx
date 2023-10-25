import { clsx } from 'clsx';
import { Color } from '../../types/colors.type';
import { useCanvasStore } from '../../store/canvas.store';

interface ColorCheckedProps {
  bg: Color;
  checkedColor: string;
  setCheckedColor: (bg: string) => void;
}

const ColorChecked: React.FC<ColorCheckedProps> = ({ bg, checkedColor, setCheckedColor }) => {
  const ctx = useCanvasStore(state => state.context);

  const handleClick = () => {
    setCheckedColor(bg);
    if (ctx) {
      ctx.strokeStyle = bg;
      ctx.fillStyle = bg;
    }
  };

  const c = (b: Color) => {
    if (bg === checkedColor) {
      return 'bg-[#ffffff] border-[8px]';
    } else {
      if (b === Color.BLACK) {
        return 'bg-[#000000] hover:scale-110';
      } else if (b === Color.WHITE) {
        return 'bg-[#ffffff] border border-slate-400 hover:scale-110';
      } else if (b === Color.RED) {
        return 'bg-[#ff0000] hover:scale-110';
      } else if (b === Color.GREEN) {
        return 'bg-[#37e237] hover:scale-110';
      } else {
        return 'bg-[#0011ff] hover:scale-110';
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `w-6 h-6 rounded-full flex justify-center items-center transition-all cursor-pointer`,
        c(bg),
        bg === checkedColor && bg === Color.WHITE ? 'border-[#c7c7c7]' : undefined,
        bg === checkedColor && bg === Color.BLACK ? 'border-[#000000]' : undefined,
        bg === checkedColor && bg === Color.RED ? 'border-[#ff0000]' : undefined,
        bg === checkedColor && bg === Color.GREEN ? 'border-[#37e237]' : undefined,
        bg === checkedColor && bg === Color.BLUE ? 'border-[#0011ff]' : undefined
      )}
    />
  );
};

export default ColorChecked;
