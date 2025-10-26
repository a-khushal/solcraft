'use client'

import React, { useRef, useEffect, useCallback } from 'react';
import { useWorkspace } from '@/hooks/useWorkspace';

function IDE() {
    const workspace = useWorkspace((state: any) => state.workspace);
    const updateFileContent = useWorkspace((state: any) => state.updateFileContent);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const editorRef = useRef<import('monaco-editor').editor.IStandaloneCodeEditor | null>(null);
    const initializedRef = useRef(false);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const activeFileRef = useRef<string>(workspace.activeFile);
    const fileContentCacheRef = useRef<Map<string, string>>(new Map());

    // Debounced save function
    const debouncedSave = useCallback((content: string, fileName: string) => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(async () => {
            try {
                await updateFileContent(fileName, content);
            } catch (error) {
                console.error('Error saving file:', error);
            }
        }, 300);
    }, [updateFileContent]);

    useEffect(() => {
        if (!containerRef.current || initializedRef.current) return;
        initializedRef.current = true;

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

            const initialContent = workspace.files.find((f: any) => f.name === workspace.activeFile)?.content || "// type here...";
            editorRef.current = monaco.editor.create(containerRef.current!, {
                value: initialContent,
                language: 'rust',
                theme: 'vs-dark',
                automaticLayout: true,
                minimap: { enabled: false },
                wordBasedSuggestions: 'off',
            });

            editorRef.current.onDidChangeModelContent(() => {
                const currentValue = editorRef.current?.getValue() ?? '';
                const activeFileName = activeFileRef.current;
                if (activeFileName) {
                    debouncedSave(currentValue, activeFileName);
                }
            });
        };

        init();

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
            editorRef.current?.dispose();
            editorRef.current = null;
        };
    }, []);

    useEffect(() => {
        activeFileRef.current = workspace.activeFile;
    }, [workspace.activeFile]);

    useEffect(() => {
        if (!editorRef.current) return;
        const activeFile = workspace.activeFile;
        const newContent = workspace.files.find((f: any) => f.name === activeFile)?.content || "// type here...";
        
        // Only update if the content for this file has actually changed
        const cachedContent = fileContentCacheRef.current.get(activeFile);
        if (cachedContent !== newContent) {
            fileContentCacheRef.current.set(activeFile, newContent);
            if (editorRef.current.getValue() !== newContent) {
                editorRef.current.setValue(newContent);
            }
        }
    }, [workspace.activeFile, workspace.files]);

    return <div ref={containerRef} style={{ height: '100vh', width: '100%' }} />;
}

export default IDE;
