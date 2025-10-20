'use client'

import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type FileTab = {
    symbol: React.ReactNode;
    fname: string;
};

interface TopbarProps {
    files: FileTab[];
    onClose: (idx: number) => void
}

export default function Topbar({ files, onClose }: TopbarProps) {
    return (
        <div className="w-full flex bg-neutral-900 border-b border-neutral-700 select-none">
            {files.map((file, i) => (
                <div
                    key={i}
                    className="group flex items-center justify-center gap-1 px-3 py-2 border-x border-neutral-700 text-xs truncate cursor-pointer
          hover:bg-neutral-700 text-neutral-400 font-medium tracking-tight"
                >
                    <span>{file.symbol}</span>
                    <span className="truncate">{file.fname}</span>
                    <X
                        className="h-3.5 w-3.5 ml-2 opacity-0 group-hover:opacity-70 hover:opacity-100 transition-opacity"
                        strokeWidth={3.5}
                        onClick={() => onClose(i)}
                    />
                </div>
            ))}
        </div>
    );
}
