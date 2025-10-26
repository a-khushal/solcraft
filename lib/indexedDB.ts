export type FileRecord = {
  id?: number;
  workspaceKey: string;
  name: string;
  content: string;
};

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

      const request = indexedDB.open("solcraft_db", 4);

      request.onupgradeneeded = () => {
        const db = request.result;

        if (!db.objectStoreNames.contains("files")) {
          const fileStore = db.createObjectStore("files", {
            keyPath: "id",
            autoIncrement: true,
          });
          fileStore.createIndex("workspace_name", ["workspaceKey", "name"], { unique: true });
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

  public async addFile(workspaceKey: string, file: { name: string; content: string }) {
    if (!this.db) throw new Error("DB not initialized");
    const tx = this.db.transaction("files", "readwrite");
    const store = tx.objectStore("files");
    store.add({ workspaceKey, ...file });
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  public async updateFile(workspaceKey: string, name: string, content: string) {
    if (!this.db) throw new Error("DB not initialized");
    const db = this.db;

    return new Promise((resolve, reject) => {
      const tx = db.transaction("files", "readwrite");
      const store = tx.objectStore("files");

      tx.onerror = () => reject(tx.error);
      tx.oncomplete = () => resolve(true);

      const findReq = store.getAll();
      findReq.onsuccess = () => {
        const allFiles = findReq.result;
        const existing = allFiles.find(file => file.workspaceKey === workspaceKey && file.name === name);

        if (existing) {
          store.put({ ...existing, content });
        } else {
          store.add({ workspaceKey, name, content });
        }
      };

      findReq.onerror = () => reject(findReq.error);
    });
  }

  public async getAllFiles(workspaceKey: string): Promise<FileRecord[]> {
    if (!this.db) throw new Error("DB not initialized");
    const db = this.db;
    return new Promise((resolve, reject) => {
      const tx = db.transaction("files", "readonly");
      const store = tx.objectStore("files");

      const req = store.getAll();
      req.onsuccess = () => {
        const allFiles = req.result;
        const filteredFiles = allFiles
          .filter(file => file.workspaceKey === workspaceKey)
          .sort((a, b) => (a.id || 0) - (b.id || 0));
        resolve(filteredFiles);
      };
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

  public async loadWorkspace(key: string): Promise<any | null> {
    if (!this.db) throw new Error("DB not initialized");
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction("workspace", "readonly");
      const store = tx.objectStore("workspace");
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result?.value ?? null);
      req.onerror = () => reject(req.error);
    });
  }

  public async deleteFile(workspaceKey: string, name: string) {
    if (!this.db) throw new Error("DB not initialized");
    const tx = this.db.transaction("files", "readwrite");
    const store = tx.objectStore("files");

    if (store.indexNames.contains("workspace_name")) {
      const index = store.index("workspace_name");
      const req = index.get([workspaceKey, name]);
      req.onsuccess = () => {
        const file = req.result;
        if (file) store.delete(file.id);
      };
    } else {
      const getAllReq = store.getAll();
      getAllReq.onsuccess = () => {
        const allFiles = getAllReq.result;
        const file = allFiles.find(f => f.workspaceKey === workspaceKey && f.name === name);
        if (file) store.delete(file.id);
      };
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  public async getAllWorkspaces(): Promise<Array<{ key: string; value: any }>> {
    if (!this.db) throw new Error("DB not initialized");
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction("workspace", "readonly");
      const store = tx.objectStore("workspace");
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
}
