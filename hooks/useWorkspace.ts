import { create } from 'zustand';
import { Workspace, WorkspaceFile, LANGUAGES } from '@/types';

type WorkspaceStore = {
    workspace: Workspace;
    addFile: (file: WorkspaceFile) => void;
    removeFile: (index: number) => void;
    setActiveFile: (fileName: string) => void;
};

export const useWorkspace = create<WorkspaceStore>((set) => ({
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

    addFile: (file) => set((state) => ({
        workspace: {
            ...state.workspace,
            files: [...state.workspace.files, file],
            activeFile: file.name
        }
    })),

    removeFile: (index) => set((state) => {
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

        return {
            workspace: {
                ...state.workspace,
                files: newFiles,
                activeFile: newActiveFile
            }
        };
    }),

    setActiveFile: (fileName) => set((state) => ({
        workspace: {
            ...state.workspace,
            activeFile: fileName
        }
    }))
}));
