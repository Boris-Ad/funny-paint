import { create } from 'zustand';

interface IUseFilling {
  filling: boolean;
  setContext: (filling: boolean) => void;
}

export const useFillingStore = create<IUseFilling>()(set => ({
  filling: false,
  setContext: filling => set(() => ({ filling })),
}));
