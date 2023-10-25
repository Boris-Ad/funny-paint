import { Navigate } from 'react-router-dom';
import Canvas from '../components/Canvas';
import { socket } from '../socket';
import Tools from '../components/Tools';
import { useUserDataStore } from '../store/user-data.store';
import React from 'react';

const PaintPage: React.FC = () => {
  const userStatus = useUserDataStore(state => state.userStatus);
  const [message,setMessage] = React.useState('')

  const sendMessage = () => {
    if(message.trim().length > 0){
      socket.emit('send_message',message,(res:string) => {
        if(res === 'ok'){
          setMessage('')
        }
        
      })
    }
    
  }

  return userStatus ? (
    <div className="h-full flex gap-3">
      <Tools />
      <div className="w-full flex gap-2 flex-col">
        <Canvas />

        <div className="relative z-0 flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Текст сообщения"
            maxLength={60}
            className="block w-full rounded-md rounded-r-none border-gray-300 shadow-sm focus:z-10
             focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
          />
          <button
          onClick={sendMessage}
            className="flex bg-white items-center space-x-1 rounded-md rounded-l-none border
           border-l-0 border-gray-300 px-2.5 text-gray-700 hover:bg-gray-100"
          >
            <span>Отправить</span>
          </button>
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/" replace={true} />
  );
};

export default PaintPage;
