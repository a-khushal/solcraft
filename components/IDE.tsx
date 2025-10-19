'use client'
import React, { useRef, useEffect, useState } from 'react';
import Editor, { OnMount, OnChange } from '@monaco-editor/react';
import { STORAGE_KEY } from '@/lib/constants';

function IDE() {
    const editorRef = useRef<any>(null);
    const [code, setCode] = useState<string>('// start typing...');

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;
    };

    const handleEditorChange: OnChange = (value, event) => {
        if (value) localStorage.setItem(STORAGE_KEY, value);
    }

    useEffect(() => {
        const value = localStorage.getItem(STORAGE_KEY);
        value ? setCode(value) : setCode("// start typing...");
    }, []);

    return (
        <Editor
            height="100vh"
            defaultLanguage="javascript"
            defaultValue={code}
            onMount={handleEditorDidMount}
            onChange={handleEditorChange}
        />
    );
}

export default IDE;