'use client'

import { LANGUAGES, WorkspaceFile } from "@/types";
import { X } from "lucide-react";
import { rustIcon, tsIcon } from "./Icons";
import { useWorkspace } from "@/hooks/useWorkspace";

export default function Topbar() {
    const workspace = useWorkspace((state) => state.workspace);
    const removeFile = useWorkspace((state) => state.removeFile);
    const setActiveFile = useWorkspace((state) => state.setActiveFile)

    return (
        <div className="w-full flex bg-neutral-900 border-b border-neutral-700 select-none shadow-lg shadow-neutral-950/80">
            {workspace.files.map((file: WorkspaceFile, i: number) => (
                <div
                    key={i}
                    className={`group flex items-center justify-center gap-1 px-3 py-2 border-x border-neutral-700 text-xs truncate cursor-pointer hover:bg-neutral-800 text-neutral-400 font-medium tracking-tight ${workspace.activeFile === file.name ? "bg-[#1e1e1e]" : ""}`}
                >
                    <span onClick={() => setActiveFile(file.name)}>
                        <span>
                            {
                                {
                                    [LANGUAGES.RUST]: rustIcon,
                                    [LANGUAGES.TYPESCRIPT]: tsIcon,
                                }[file.language as LANGUAGES]
                            }
                        </span>
                        <span className="truncate">{file.name}</span>
                    </span>
                    <X
                        className="h-3.5 w-3.5 ml-2 opacity-0 group-hover:opacity-70 hover:opacity-100 transition-opacity"
                        strokeWidth={3.5}
                        onClick={() => removeFile(i)}
                    />
                </div>
            ))}
        </div>
    );
}
