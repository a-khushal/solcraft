import { create } from 'zustand';
import { Workspace, WorkspaceFile, LANGUAGES } from '@/types';

export const useWorkspace = create((set) => ({
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

    addFile: (file: WorkspaceFile) => set((state: any) => ({
        workspace: {
            ...state.workspace,
            files: [...state.workspace.files, file],
            activeFile: file.name
        }
    })),

    removeFile: (index: number) => set((state: any) => {
        const newFiles = state.workspace.files.filter((_: any, idx: number) => idx !== index);
        return {
            workspace: {
                ...state.workspace,
                files: newFiles
            }
        };
    })
}));
