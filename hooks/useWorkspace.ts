import { create } from 'zustand';
import { Workspace, WorkspaceFile, LANGUAGES } from '@/types';
import { DB } from '@/lib/indexedDB';
import { getLanguageFromFilename } from '@/lib/extlang';

type WorkspaceStore = {
    workspace: Workspace;
    isLoading: boolean;
    error: string | null;
    addFile: (file: WorkspaceFile) => Promise<void>;
    removeFile: (index: number) => Promise<void>;
    setActiveFile: (fileName: string) => Promise<void>;
    updateFileContent: (fileName: string, content: string) => Promise<void>;
    loadWorkspace: (workspaceKey: string) => Promise<void>;
    saveWorkspace: () => Promise<void>;
    clearError: () => void;
};

export const useWorkspace = create<WorkspaceStore>((set, get) => ({
    workspace: {
        name: 'workspace1',
        files: [
            {
                name: "lib.rs",
                language: LANGUAGES.RUST,
                content: "//type something..."
            }
        ],
        activeFile: "lib.rs"
    },
    isLoading: false,
    error: null,

    addFile: async (file) => {
        try {
            set((state) => ({
                workspace: {
                    ...state.workspace,
                    files: [...state.workspace.files, file],
                    activeFile: file.name
                }
            }));

            const db = await DB.getInstance();
            await db.addFile(get().workspace.name, {
                name: file.name,
                content: file.content
            });

            await db.saveWorkspace(get().workspace.name, {
                activeFile: file.name,
                lastModified: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error adding file:', error);
            set({ error: error instanceof Error ? error.message : 'Failed to add file' });
        }
    },

    removeFile: async (index) => {
        try {
            const state = get();
            const removedFile = state.workspace.files[index];

            const newFiles = state.workspace.files.filter((_, idx) => idx !== index);
            let newActiveFile = state.workspace.activeFile;

            if (removedFile?.name === state.workspace.activeFile) {
                if (newFiles.length === 0) {
                    newActiveFile = "";
                } else if (index < newFiles.length) {
                    newActiveFile = newFiles[index].name;
                } else {
                    newActiveFile = newFiles[newFiles.length - 1].name;
                }
            }

            set({
                workspace: {
                    ...state.workspace,
                    files: newFiles,
                    activeFile: newActiveFile
                }
            });

            if (removedFile) {
                const db = await DB.getInstance();
                await db.deleteFile(state.workspace.name, removedFile.name);
            }

            if (newActiveFile !== state.workspace.activeFile) {
                const db = await DB.getInstance();
                await db.saveWorkspace(state.workspace.name, {
                    activeFile: newActiveFile,
                    lastModified: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error('Error removing file:', error);
            set({ error: error instanceof Error ? error.message : 'Failed to remove file' });
        }
    },

    setActiveFile: async (fileName) => {
        try {
            const state = get();
            const db = await DB.getInstance();

            await db.saveWorkspace(state.workspace.name, {
                activeFile: fileName,
                lastModified: new Date().toISOString()
            });

            set((state) => ({
                workspace: {
                    ...state.workspace,
                    activeFile: fileName
                }
            }));
        } catch (error) {
            console.error('Error saving active file:', error);
            set((state) => ({
                workspace: {
                    ...state.workspace,
                    activeFile: fileName
                }
            }));
        }
    },

    updateFileContent: async (fileName, content) => {
        try {
            const db = await DB.getInstance();
            await db.updateFile(get().workspace.name, fileName, content);

            set((state) => ({
                workspace: {
                    ...state.workspace,
                    files: state.workspace.files.map(file =>
                        file.name === fileName ? { ...file, content } : file
                    )
                }
            }));
        } catch (error) {
            console.error('Error updating file content:', error);
            set({ error: error instanceof Error ? error.message : 'Failed to update file content' });
        }
    },

    loadWorkspace: async (workspaceKey) => {
        set({ isLoading: true });
        try {
            const db = await DB.getInstance();
            const files = await db.getAllFiles(workspaceKey);

            const workspaceData = await db.loadWorkspace(workspaceKey);

            let workspaceFiles: WorkspaceFile[] = files.map(file => ({
                name: file.name,
                language: getLanguageFromFilename(file.name),
                content: file.content
            }));

            if (workspaceFiles.length === 0) {
                const defaultFile: WorkspaceFile = {
                    name: "lib.rs",
                    language: LANGUAGES.RUST,
                    content: "//type something..."
                };

                await db.addFile(workspaceKey, {
                    name: defaultFile.name,
                    content: defaultFile.content
                });

                workspaceFiles = [defaultFile];
            }

            let activeFile = "lib.rs";
            if (workspaceData?.activeFile && workspaceFiles.some(f => f.name === workspaceData.activeFile)) {
                activeFile = workspaceData.activeFile;
            } else if (workspaceFiles.length > 0) {
                activeFile = workspaceFiles[0].name;
            }

            set({
                workspace: {
                    name: workspaceKey,
                    files: workspaceFiles,
                    activeFile: activeFile
                },
                isLoading: false
            });
        } catch (error) {
            console.error('Error loading workspace:', error);
            const errorMessage = error instanceof Error ? error.message :
                typeof error === 'string' ? error :
                    'Failed to load workspace';
            set({ isLoading: false, error: errorMessage });
        }
    },

    saveWorkspace: async () => {
        try {
            const state = get();
            const db = await DB.getInstance();

            await db.saveWorkspace(state.workspace.name, {
                activeFile: state.workspace.activeFile,
                lastModified: new Date().toISOString()
            });

            for (const file of state.workspace.files) {
                await db.updateFile(state.workspace.name, file.name, file.content);
            }
        } catch (error) {
            console.error('Error saving workspace:', error);
            set({ error: error instanceof Error ? error.message : 'Failed to save workspace' });
        }
    },

    clearError: () => set({ error: null })
}));
