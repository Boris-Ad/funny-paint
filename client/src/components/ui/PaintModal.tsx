import React from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import InputModal from './InputModal';
import { useRoomsSocketStore } from '../../store/rooms-socket.store';

interface PaintModalProps {
  setPaintModal: (paintModal: boolean) => void;
  onCreatePaint: (paintName: string, userName: string) => void;
}

const PaintModal: React.FC<PaintModalProps> = ({ setPaintModal, onCreatePaint }) => {
  const [paintName, setPaintName] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [errorPaint, setErrorPaint] = React.useState('');
  const [errorUser, setErrorUser] = React.useState('');
  const rooms = useRoomsSocketStore(state => state.rooms);

  const createPaint = () => {
    for (let room of rooms) {
      if (room.paintName?.toLowerCase() === paintName.trim().toLowerCase()) {
        return setErrorPaint('Не допускается одинаковых имен');
      }
    }
    if (paintName.trim().length === 0) {
      return setErrorPaint('Обязательно для заполнения');
    }
    if (userName.trim().length === 0) {
      return setErrorUser('Обязательно для заполнения');
    }

    onCreatePaint(paintName, userName);
  };
  return (
    <div className="absolute inset-x-0 inset-y-0 bg-black/40 flex justify-center items-center animate-modal">
      <div className="w-[500px] p-4  bg-white rounded-md -translate-y-10 shadow-lg flex flex-col text-gray-700">
        <div className="flex justify-between items-center mb-2 font-medium">
          <p className="text-xl ">Создание холста</p>
          <button onClick={() => setPaintModal(false)} className="hover:bg-gray-100 rounded-md p-1">
            <IoCloseOutline className={'w-6 h-6'} />
          </button>
        </div>
        <div className="flex-1">
          <InputModal
            label="Придумайте имя холсту:"
            error={errorPaint}
            setError={setErrorPaint}
            value={paintName}
            setValue={setPaintName}
          />
          <InputModal
            label="Ваше имя в чате:"
            error={errorUser}
            setError={setErrorUser}
            value={userName}
            setValue={setUserName}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={createPaint}
              className="rounded-lg border border-primary-500 bg-primary-500 px-5 py-2.5 text-center text-sm font-medium
               text-white shadow-sm transition-all hover:border-primary-700 hover:bg-primary-700 focus:ring focus:ring-primary-200 "
            >
              Принять
            </button>
            <button
              type="button"
              onClick={() => setPaintModal(false)}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-center text-sm font-medium
               text-gray-700 shadow-sm transition-all hover:bg-gray-100 focus:ring focus:ring-gray-100 "
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaintModal;
