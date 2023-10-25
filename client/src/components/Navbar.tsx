import { Link, useLocation } from 'react-router-dom';
import { socket } from '../socket';
import { IoChevronDownOutline } from 'react-icons/io5';
import React from 'react';
import clsx from 'clsx';
import { useUserDataStore } from '../store/user-data.store';
import { useMessagesStore } from '../store/messages.store';

const Navbar: React.FC = () => {
  const location = useLocation();
  const paintName = useUserDataStore(state => state.paintName);
  const userStatus = useUserDataStore(state => state.userStatus);
  const userName = useUserDataStore(state => state.userName);
  const [dropdown, setDropdown] = React.useState(false);
  const [usersInSession, setUsersInSession] = React.useState<Array<string>>([]);
  const [messages, setMessages] = useMessagesStore(state => [state.messages, state.setMessages]);

  window.addEventListener('beforeunload', event => {
    event.preventDefault();
    return (event.returnValue = '');
  });

  React.useEffect(() => {
    socket.on('room_close', () => {
      setUsersInSession([]);
    });

    socket.on('users_from_room', (data: unknown) => {
      if (data instanceof Array) {
        setUsersInSession(data);
      }
    });
    return () => {
      socket.off('users_from_room');
      socket.off('room_close');
    };
  }, []);

  React.useEffect(() => {
    socket.on('new_message', (data: unknown) => {
      if (data) {
        const res = data as { userName: string; message: string };
        setMessages([res, ...messages]);
      }
    });

    return () => {
      socket.off('new_message');
    };
  }, [messages]);

  return (
    <div className="h-[50px] px-4 bg-white flex items-center justify-between text-slate-700 rounded-md shadow-md">
      <span className="text-orange-400 font-['Poppins'] italic text-lg font-medium">Funny paint</span>
      {location.pathname !== '/' && (
        <div className="flex gap-5 items-center">
          <p className="text-lg text-blue-500">{userName}</p>

          <div className="flex gap-1 items-center relative">
            <div className="w-[600px] h-8  px-2 py-1 border rounded z-10 text-slate-700 flex items-center">
              {messages.length > 0 && (
                <p className="line-clamp-1">
                  <span className="text-orange-500">{messages[0]?.userName}:</span> {messages[0]?.message}
                </p>
              )}
            </div>

            <button onClick={() => setDropdown(prev => !prev)} className="p-2 rounded-md hover:bg-slate-100 cursor-pointer">
              <IoChevronDownOutline className={clsx('transition-transform', dropdown ? 'rotate-180' : undefined)} />
            </button>
            <div
              className={clsx(
                'absolute left-0 w-[600px] p-2 bg-white flex flex-col rounded-md shadow-lg transition-all duration-300 overflow-y-auto',
                dropdown ? 'top-10 border h-[500px] opacity-100' : 'border-0 h-0 top-0 opacity-0'
              )}
            >
              <div className="flex-1">
                {messages.map((mess, inx) => (
                  <p key={inx} className="mb-1">
                    <span className={clsx(userName === mess.userName ? 'text-blue-500' : 'text-orange-500', 'text-lg')}>
                      {mess.userName}:
                    </span>{' '}
                    {mess.message}
                  </p>
                ))}
              </div>
              <div className="flex flex-nowrap gap-2 border-t pt-1 text-orange-500 overflow-x-auto">
                {usersInSession.map((user, inx) => (
                  <p key={inx}>{user}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <p>Участников: </p>
            <span>{usersInSession.length}</span>
          </div>
        </div>
      )}

      <div className="flex gap-4 items-center">
        {location.pathname !== '/' ? (
          <Link to={'/'} className="text-lg hover:text-orange-400">
            Home
          </Link>
        ) : (
          userStatus && (
            <Link to={'paint/' + paintName} className="text-lg hover:text-orange-400">
              Paint
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default Navbar;
