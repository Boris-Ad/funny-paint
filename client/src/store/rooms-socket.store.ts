import { create } from 'zustand';
import { IUser } from '../types/sockets.type';

interface IUseRoomsSocket {
  rooms: IUser[];
  setRooms: (rooms: IUser[] | []) => void;
}

export const useRoomsSocketStore = create<IUseRoomsSocket>()(set => ({
  rooms: [],
  setRooms: rooms => set(() => ({ rooms })),
}));
