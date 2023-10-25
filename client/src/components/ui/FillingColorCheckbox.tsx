import { useFillingStore } from '../../store/filling.store';

const FillingColorCheckbox: React.FC = () => {
  const [filling, setFilling] = useFillingStore(state => [state.filling, state.setContext]);
  return (
    <div className="flex items-center space-x-2 mt-2">
      <input
        type="checkbox"
        id="fill"
        checked={filling}
        onChange={e => setFilling(e.target.checked)}
        className="h-5 w-5 rounded border-gray-300 text-primary-600 shadow-sm
           focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0"
      />
      <label htmlFor="fill" className="text-gray-700 text-lg">
        Заливка
      </label>
    </div>
  );
};

export default FillingColorCheckbox;
