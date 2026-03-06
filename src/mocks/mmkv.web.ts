export class MMKV {
  private store: Map<string, string> = new Map();

  set(key: string, value: string | number | boolean) {
    this.store.set(key, String(value));
  }
  getString(key: string) {
    return this.store.get(key);
  }
  getNumber(key: string) {
    const v = this.store.get(key);
    return v !== undefined ? Number(v) : undefined;
  }
  getBoolean(key: string) {
    const v = this.store.get(key);
    return v !== undefined ? v === 'true' : undefined;
  }
  delete(key: string) {
    this.store.delete(key);
  }
  remove(key: string) {
    this.store.delete(key);
  }
  contains(key: string) {
    return this.store.has(key);
  }
  clearAll() {
    this.store.clear();
  }
}

export function createMMKV(config?: { id?: string }) {
  const store = new Map<string, string>();
  return {
    getString: (key: string) => store.get(key),
    set: (key: string, value: string | number | boolean) => store.set(key, String(value)),
    remove: (key: string) => store.delete(key),
    delete: (key: string) => store.delete(key),
    contains: (key: string) => store.has(key),
    clearAll: () => store.clear(),
    getNumber: (key: string) => {
      const v = store.get(key);
      return v !== undefined ? Number(v) : undefined;
    },
    getBoolean: (key: string) => {
      const v = store.get(key);
      return v !== undefined ? v === 'true' : undefined;
    },
  };
}
