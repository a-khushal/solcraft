'use client'

import { useSidebar } from "@/hooks/useSidebar";
import { useWorkspace } from "@/hooks/useWorkspace";
import { extensionToLang } from "@/lib/extlang";
import { LANGUAGES } from "@/types";
import { useState } from "react";

export default function ExpandableSidebar() {
    const isOpen = useSidebar((state: any) => state.isOpen);
    const addFile = useWorkspace((state: any) => state.addFile);
    const [filename, setFilename] = useState("");

    const handleAddFile = () => {
        const name = filename.trim();
        const parts = name.split(".");
        const ext = parts.length > 1 ? (parts.pop() || "").toLowerCase() : "";
        const mapped = extensionToLang[ext as keyof typeof extensionToLang];
        const language = mapped === 'rust'
            ? LANGUAGES.RUST
            : mapped === 'typescript'
                ? LANGUAGES.TYPESCRIPT
                : ext === 'rs'
                    ? LANGUAGES.RUST
                    : LANGUAGES.TYPESCRIPT;
        addFile({ content: "//" + name + "...", name, language });
        setFilename("");
    };

    if (!isOpen) return null;
    return (
        <div className="fixed top-0 left-12 z-20 h-screen w-[20rem] bg-neutral-900 border-r border-neutral-700 overflow-hidden">
            <div className='w-full border-b border-neutral-700 flex justify-center items-center py-1.5'>
                <span className='text-sm text-neutral-400 font-medium tracking-tight'>EXPLORER</span>
            </div>
            <div
                className="transition-transform duration-300 ease-out transform"
                style={{ transform: isOpen ? "translateX(0)" : "translateX(-100%)" }}
            >
                <input
                    type="text"
                    onChange={(e) => setFilename(e.target.value)}
                    value={filename}
                    className='border border-white mx-2'
                />
                <button onClick={handleAddFile} disabled={!filename}>
                    create file+
                </button>
            </div>
        </div>
    );
}
