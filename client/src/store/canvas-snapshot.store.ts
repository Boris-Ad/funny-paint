import { create } from 'zustand';

interface IUseCanvasSnapshot {
  undo: ImageData[];
  replace: ImageData[];
  setUndo: (snapshot: ImageData) => void;
  setReplace: (snapshot: ImageData) => void;
  clearUndo: () => void;
  clearReplace: () => void;
  clearSnapshot: () => void;
}

export const useCanvasSnapshotStore = create<IUseCanvasSnapshot>()(set => ({
  undo: [],
  replace: [],
  setUndo: undo => set(store => ({ undo: [...store.undo, undo] })),
  setReplace: replace => set(store => ({ replace: [...store.replace, replace] })),
  clearUndo: () => set(() => ({ undo: [] })),
  clearReplace: () => set(() => ({ replace: [] })),
  clearSnapshot: () => set(() => ({ undo: [], replace: [] })),
}));
