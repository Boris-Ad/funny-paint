import { create } from 'zustand';

interface IUseMessages {
  messages: { userName: string; message: string }[];
  setMessages: (messages: { userName: string; message: string }[] | []) => void;
}

export const useMessagesStore = create<IUseMessages>()(set => ({
  messages: [],
  setMessages: messages => set(() => ({ messages })),
}));
