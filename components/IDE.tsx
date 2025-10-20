'use client'

import React, { useRef, useEffect } from 'react';
import { STORAGE_KEY } from '@/lib/constants';

function IDE() {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        let editor: import('monaco-editor').editor.IStandaloneCodeEditor | null = null;
        let disposeChange: import('monaco-editor').IDisposable | null = null;

        const init = async () => {
            const monaco = (await import('monaco-editor')).default ?? (await import('monaco-editor'));
            await import('monaco-editor/esm/vs/basic-languages/rust/rust.contribution');

            (self as any).MonacoEnvironment = {
                getWorker() {
                    return new Worker(
                        new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url),
                        { type: 'module' }
                    );
                },
            };

            const initial = localStorage.getItem(STORAGE_KEY) ?? '// start typing...';
            editor = monaco.editor.create(containerRef.current!, {
                value: initial,
                language: 'rust',
                theme: 'vs-dark',
                automaticLayout: true,
                minimap: { enabled: false },
                wordBasedSuggestions: 'off',
            });

            disposeChange = editor.onDidChangeModelContent(() => {
                const currentValue = editor?.getValue() ?? '';
                localStorage.setItem(STORAGE_KEY, currentValue);
            });
        };

        init();

        return () => {
            disposeChange?.dispose();
            editor?.dispose();
        };
    }, []);

    return (
        <div ref={containerRef} style={{ height: '100vh', width: '100%' }} />
    );
}

export default IDE;