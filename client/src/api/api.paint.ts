import { useUserDataStore } from '../store/user-data.store';
import { api } from './api.config';

export const uploadPaint = (canvas: HTMLCanvasElement) => {
  const paintName = useUserDataStore.getState().paintName;
  if (!paintName) return;
  return api.post('paint', { json: { paintName, canvas: canvas.toDataURL() } }).json();
};

export const getPaint = (paintName: string): Promise<string> => api.get('paint/' + paintName).text();

export const deletePaint = (paintName: string) => {
  if (paintName) {
    api.delete('paint/' + paintName);
  }
};
