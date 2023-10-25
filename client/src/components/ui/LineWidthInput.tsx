import React from 'react';
import Tooltip from './Tooltip';

interface LineWidthInputProps {
  ctx: CanvasRenderingContext2D | null | undefined;
}

const LineWidthInput: React.FC<LineWidthInputProps> = ({ ctx }) => {
  const [lineWidth, setLineWidth] = React.useState(3);
  if (ctx) {
    ctx.lineWidth = lineWidth;
  }

  return (
    <div className='relative group'>
      <input
        type="range"
        min="1"
        max="20"
        step="1"
        value={lineWidth}
        onChange={e => setLineWidth(Number(e.currentTarget.value))}
        className="mb-3 cursor-pointer"
      />
      <Tooltip>Толщина линии</Tooltip>
    </div>
  );
};

export default LineWidthInput;
