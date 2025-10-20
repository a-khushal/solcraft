'use client';
import Image from 'next/image';

export function SidebarStrip({ toggleSidebar }: { toggleSidebar: () => void }) {
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
                    className="my-3 p-0 cursor-pointer flex items-center justify-center hover:opacity-75 transition-opacity"
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
                            className="w-6 h-6 object-contain filter invert opacity-40"
                            priority
                        />
                    </span>
                </button>
            ))}
        </div>
    );
}


export function ExpandableSidebar({ isOpen }: { isOpen: boolean }) {
    if (!isOpen) return null;
    return (
        <div
            className="fixed top-0 left-11 z-20 h-screen w-[20rem] bg-neutral-900 border-r border-neutral-700"
        >
            <div className='w-full border-b border-neutral-700 flex justify-center items-center py-1.5'>
                <span className='text-sm text-neutral-400 font-medium tracking-tight'>EXPLORER</span>
            </div>
        </div>
    );
}
