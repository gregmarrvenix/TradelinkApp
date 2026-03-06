import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({ id: 'tradelink-app' });

export const mmkvStorage = {
  getItem: (name: string): string | null => {
    return storage.getString(name) ?? null;
  },
  setItem: (name: string, value: string): void => {
    storage.set(name, value);
  },
  removeItem: (name: string): void => {
    storage.remove(name);
  },
};
