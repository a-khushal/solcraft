import { LANGUAGES } from '@/types';

export const extensionToLang = {
    'rs': 'rust',
    'ts': 'typescript',
};

export const getLanguageFromFilename = (filename: string): LANGUAGES => {
    const parts = filename.split(".");
    const ext = parts.length > 1 ? (parts.pop() || "").toLowerCase() : "";
    const mapped = extensionToLang[ext as keyof typeof extensionToLang];
    
    if (mapped === 'rust') {
        return LANGUAGES.RUST;
    } else if (mapped === 'typescript') {
        return LANGUAGES.TYPESCRIPT;
    } else if (ext === 'rs') {
        return LANGUAGES.RUST;
    } else {
        return LANGUAGES.TYPESCRIPT;
    }
};
