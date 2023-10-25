import clsx from 'clsx';

interface TooltipProps {
  children: React.ReactNode;
  place?: 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ children, place }) => {
  return (
    <div
      className={clsx(
        'w-max p-1 absolute -top-10  bg-white border rounded  invisible group-hover:visible shadow-md text-slate-600',
        place === 'left' ? '-translate-x-2/3' : place === 'right' ? 'translate-x-[10px]' : 'right-1/2 translate-x-1/2'
      )}
    >
      {children}
    </div>
  );
};

export default Tooltip;
