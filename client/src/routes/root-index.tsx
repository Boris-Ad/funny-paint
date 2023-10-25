import React from 'react';
import Modal from '../components/ui/PaintModal';
import { useCanvasSnapshotStore } from '../store/canvas-snapshot.store';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';
import { useRoomsSocketStore } from '../store/rooms-socket.store';
import JoinModal from '../components/ui/JoinModal';
import { useUserDataStore } from '../store/user-data.store';
import { useMessagesStore } from '../store/messages.store';
import { deletePaint } from '../api/api.paint';

const RootIndexPage: React.FC = () => {
  const navigate = useNavigate();
  const clearSnapshot = useCanvasSnapshotStore(state => state.clearSnapshot);
  const [paintModal, setPaintModal] = React.useState(false);
  const [joinModal, setJoinModal] = React.useState<string | null>(null);
  const userStatus = useUserDataStore(state => state.userStatus);
  const setUserStatus = useUserDataStore(state => state.setUserStatus);
  const setUserName = useUserDataStore(state => state.setUserName);
  const [paintName, setPaintName] = useUserDataStore(state => [state.paintName, state.setPaintName]);
  const setMessages = useMessagesStore(state => state.setMessages);
  const rooms = useRoomsSocketStore(state => state.rooms);

  const onDeletePaint = () => {
    if (paintName) {
      socket.emit('remove_room', paintName);
      setUserStatus(null);
      setPaintName(null);
      setUserName(null);
      clearSnapshot();
      deletePaint(paintName);
    }
  };

  const joinPaint = (userName: string) => {
    socket.emit('join_room', { paintName: joinModal, userName, userStatus: 'quest' }, async (data: { userName: string }) => {
      if (data.userName && joinModal) {
        setUserStatus('quest');
        setUserName(userName);
        setPaintName(joinModal);
        setJoinModal(null);
        setMessages([]);
        navigate('paint/' + joinModal);
      }
    });
  };

  const leavePaint = () => {
    setUserName(null);
    setPaintName(null);
    socket.emit('leave_room', paintName);
    setUserStatus(null);
  };

  const onCreatePaint = (paintName: string, userName: string) => {
    const screenX = window.screen.width;
    const screenY = window.screen.height;
    setPaintName(paintName);
    setUserStatus('admin');
    setUserName(userName);
    setMessages([]);
    socket.emit('create_room', { paintName, userName, userStatus: 'admin', screenSize: screenX + '/' + screenY });
    navigate('paint/' + paintName);
  };

  return (
    <div className="h-full">
      <section className="w-[250px] h-full bg-white rounded-md p-4 flex flex-col">
        <div className="flex-1">
          {userStatus === 'admin' && paintName && (
            <button
              onClick={onDeletePaint}
              className="w-full py-2 my-2 border border-slate-300 rounded cursor-pointer
           hover:border-sky-500 active:ring active:ring-primary-200 active:text-slate-500"
            >
              Удалить холст
            </button>
          )}
          {userStatus === null && (
            <button
              onClick={() => setPaintModal(true)}
              className="w-full py-2 my-2 border border-slate-300 rounded cursor-pointer
              hover:border-sky-500 active:ring active:ring-primary-200 active:text-slate-500"
            >
              Создать холст
            </button>
          )}

          {userStatus === 'quest' && (
            <button
              onClick={leavePaint}
              className="w-full py-2 my-2 border border-slate-300 rounded cursor-pointer
              hover:border-sky-500 active:ring active:ring-primary-200 active:text-slate-500"
            >
              Покинуть рисунок
            </button>
          )}

          {userStatus === null && <h3 className="my-3 text-lg leading-5">Присоединиться к рисунку:</h3>}
          {userStatus === null &&
            rooms?.map(room => (
              <button
                key={room.socketId}
                onClick={() => setJoinModal(room.paintName)}
                className="w-full py-1 rounded-md hover:bg-slate-100"
              >
                <p className="line-clamp-1 text-lg">{room.paintName}</p>
                <p className="line-clamp-1 text-sm">{room.screenSize}</p>
              </button>
            ))}
        </div>

        <div className="border-t pt-1">
          <p className="text-rose-500">Внимание!</p>
          <p className="leading-4 text-sm">Если размеры мониторов отличаются, рисунок будет наноситься некорректно</p>
        </div>
      </section>
      {joinModal && <JoinModal setJoinModal={setJoinModal} onJoinPaint={joinPaint} />}
      {paintModal && <Modal setPaintModal={setPaintModal} onCreatePaint={onCreatePaint} />}
    </div>
  );
};

export default RootIndexPage;
