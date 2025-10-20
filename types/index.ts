export type File = {
    name: string;
    language: string;
    content: string;
};

export type Workspace = {
    name: string;
    files: File[];
    activeFile: string;
};