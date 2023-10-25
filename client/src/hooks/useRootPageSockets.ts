import React from 'react';
import { socket } from '../socket';
import { useRoomsSocketStore } from '../store/rooms-socket.store';
import { IUser } from '../types/sockets.type';

export const useRootPageSockets = () => {

  const setRooms = useRoomsSocketStore(state => state.setRooms);

  React.useEffect(() => {
    function onConnect() {
     
    }

    function onDisconnect() {
      
    }
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    socket.on('existing_rooms', (data: IUser[] | undefined) => {
      if (data instanceof Array) {
        setRooms(data);
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);
};
