export class DB {
  private static instance: DB;
  private db: IDBDatabase | null = null;

  private constructor() { }

  static async getInstance(): Promise<DB> {
    if (!DB.instance) {
      DB.instance = new DB();
      await DB.instance.openDB();
    }
    return DB.instance;
  }

  private openDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") return resolve();

      const request = indexedDB.open("solcraft_db", 2);

      request.onupgradeneeded = () => {
        const db = request.result;

        if (!db.objectStoreNames.contains("files")) {
          const fileStore = db.createObjectStore("files", {
            keyPath: "id",
            autoIncrement: true,
          });
          fileStore.createIndex("name", "name", { unique: true });
        }

        if (!db.objectStoreNames.contains("workspace")) {
          db.createObjectStore("workspace", { keyPath: "key" });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onerror = (e) => reject(e);
    });
  }

  public async addFile(file: { name: string; content: string }) {
    if (!this.db) throw new Error("DB not initialized");
    const tx = this.db.transaction("files", "readwrite");
    const store = tx.objectStore("files");
    store.add(file);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  async updateFile(name: string, content: string) {
    if (!this.db) throw new Error("DB not initialized");
    const tx = this.db.transaction("files", "readwrite");
    const store = tx.objectStore("files");
    const index = store.index("name");

    const req = index.get(name);
    req.onsuccess = () => {
      const existing = req.result;
      if (existing) {
        store.put({ ...existing, content });
      } else {
        store.add({ name, content });
      }
    };

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  async getAllFiles(): Promise<Array<{ id: number; name: string; content: string }>> {
    if (!this.db) throw new Error("DB not initialized");
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("DB not initialized"));
        return;
      }

      const tx = this.db.transaction("files", "readonly");
      const store = tx.objectStore("files");
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  public async saveWorkspace(key: string, value: any) {
    if (!this.db) throw new Error("DB not initialized");
    const tx = this.db.transaction("workspace", "readwrite");
    const store = tx.objectStore("workspace");
    store.put({ key, value });
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  async deleteFile(id: number) {
    if (!this.db) throw new Error("DB not initialized");
    const tx = this.db.transaction("files", "readwrite");
    const store = tx.objectStore("files");
    store.delete(id);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  async loadWorkspace(key: string): Promise<any | null> {
    if (!this.db) throw new Error("DB not initialized");
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("DB not initialized"));
        return;
      }
      const tx = this.db.transaction("workspace", "readonly");
      const store = tx.objectStore("workspace");
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result?.value ?? null);
      req.onerror = () => reject(req.error);
    });
  }
}

