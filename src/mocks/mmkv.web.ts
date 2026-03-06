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
  contains(key: string) {
    return this.store.has(key);
  }
  clearAll() {
    this.store.clear();
  }
}
