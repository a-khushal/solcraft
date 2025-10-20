
export enum LANGUAGES {
    RUST,
    TYPESCRIPT
}

export type WorkspaceFile = {
    name: string;
    language: LANGUAGES;
    content: string;
};

export type Workspace = {
    name: string;
    files: WorkspaceFile[];
    activeFile: string;
};