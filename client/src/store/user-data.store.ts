import { create } from 'zustand';

interface IUseUserData {
  socketId: string | null;
  userStatus: 'quest' | 'admin' | null;
  paintName: string | null;
  userName: string | null;
  screenSize: string | null;

  setSocketId: (socketId: string | null) => void;
  setUserStatus: (userStatus: 'quest' | 'admin' | null) => void;
  setPaintName: (paintName: string | null) => void;
  setUserName: (userName: string | null) => void;
  setScreenSize: (screenSize: string | null) => void;
}

export const useUserDataStore = create<IUseUserData>()(set => ({
  socketId: null,
  userStatus: null,
  paintName: null,
  userName: null,
  screenSize: null,

  setSocketId: socketId => set(() => ({ socketId })),
  setUserStatus: userStatus => set(() => ({ userStatus })),
  setPaintName: paintName => set(() => ({ paintName })),
  setUserName: userName => set(() => ({ userName })),
  setScreenSize: screenSize => set(() => ({ screenSize })),
}));
