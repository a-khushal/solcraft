'use client';
import Image from 'next/image';
import { useSidebar } from '@/hooks/useSidebar';
import { useWorkspace } from '@/hooks/useWorkspace';
import { LANGUAGES } from '@/types';

export function SidebarStrip() {
    const toggleSidebar = useSidebar((state: any) => state.toggleSidebar);
    const buttonData = [
        { title: 'Explorer', src: '/explorer.png' },
        { title: 'Build', src: '/build.png' },
        { title: 'Test', src: '/test.png' },
    ];

    return (
        <div className="h-screen flex flex-col items-center box-border border-r border-neutral-700 bg-[#1e1e1e] w-11">
            {buttonData.map((btn) => (
                <button
                    key={btn.title}
                    className="my-3 p-0 cursor-pointer flex items-center justify-center"
                    title={btn.title}
                    type="button"
                    onClick={toggleSidebar}
                >
                    <span className="w-8 h-8 block">
                        <Image
                            src={btn.src}
                            alt={btn.title}
                            width={32}
                            height={32}
                            className="w-6 h-6 object-contain filter invert opacity-40 hover:opacity-85"
                            priority
                        />
                    </span>
                </button>
            ))}
        </div>
    );
}

export function ExpandableSidebar() {
    const isOpen = useSidebar((state: any) => state.isOpen);
    if (!isOpen) return null;

    const addFile = useWorkspace((state: any) => state.addFile);
    const handleAddFile = () => {
        addFile({ content: "// type here...", name: Math.random().toString()+".ts", language: LANGUAGES.TYPESCRIPT });
    };

    return (
        <div
            className="fixed top-0 left-11 z-20 h-screen w-[20rem] bg-neutral-900 border-r border-neutral-700"
        >
            <div className='w-full border-b border-neutral-700 flex justify-center items-center py-1.5'>
                <span className='text-sm text-neutral-400 font-medium tracking-tight'>EXPLORER</span>
            </div>
            <button onClick={handleAddFile}>
                create file+
            </button>
        </div>
    );
}
