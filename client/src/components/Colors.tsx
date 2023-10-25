import React from 'react';
import ColorChecked from './ui/ColorChecked';
import { Color } from '../types/colors.type';
import Tooltip from './ui/Tooltip';

interface ColorsProps {
  ctx: CanvasRenderingContext2D | null | undefined;
}

const Colors: React.FC<ColorsProps> = ({ ctx }) => {
  const [checkedColor, setCheckedColor] = React.useState<string>(Color.BLACK);
  const colors = Object.values(Color);

  if (ctx) {
    ctx.strokeStyle = checkedColor;
    ctx.fillStyle = checkedColor;
  }

  return (
    <div className="my-4 flex gap-2">
      {colors.map(color => (
        <ColorChecked key={color} bg={color} checkedColor={checkedColor} setCheckedColor={setCheckedColor} />
      ))}
      <div className="relative group">
        <input
          type="color"
          value={checkedColor}
          onChange={e => setCheckedColor(e.currentTarget.value)}
          className="cursor-pointer rounded hover:ring"
        />
        <Tooltip>Выбрать цвет</Tooltip>
      </div>
    </div>
  );
};

export default Colors;
