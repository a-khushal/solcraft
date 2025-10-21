'use client';
import Image from 'next/image';
import { useSidebar } from '@/hooks/useSidebar';
import { useState } from 'react';

export default function SidebarStrip() {
    const isOpen = useSidebar((state: any) => state.isOpen);
    const toggleSidebar = useSidebar((state: any) => state.toggleSidebar);
    const buttonData = [
        { title: 'Explorer', src: '/explorer.png' },
        { title: 'Build', src: '/build.png' },
        { title: 'Test', src: '/test.png' },
    ];
    const [selectedTab, setSelectedTab] = useState<string>(buttonData[0].title);

    const handleClick = (btnTitle: string) => {
        if (btnTitle === 'Explorer') {
            if (isOpen && selectedTab === 'Explorer') {
                toggleSidebar();
            } else {
                if (!isOpen) toggleSidebar();
                setSelectedTab('Explorer');
            }
        } else {
            if (isOpen && selectedTab !== btnTitle) {
                setSelectedTab(btnTitle);
            } else if (isOpen && selectedTab === btnTitle) {
                toggleSidebar();
            } else {
                toggleSidebar();
                setSelectedTab(btnTitle);
            }
        }
    };

    return (
        <div className="h-screen flex flex-col items-center box-border border-r border-neutral-700 bg-[#1e1e1e] w-12">
            {buttonData.map((btn) => {
                const isSelected = selectedTab === btn.title && isOpen;
                return (
                    <button
                        key={btn.title}
                        type="button"
                        title={btn.title}
                        onClick={() => handleClick(btn.title)}
                        className={`w-full h-12 cursor-pointer flex flex-col items-center justify-center transition-colors duration-100 ${isSelected ? "bg-neutral-700 opacity-85" : ""}`}
                    >
                        <span className="w-8 h-8 flex items-center justify-center mb-0.5">
                            <Image
                                src={btn.src}
                                alt={btn.title}
                                width={32}
                                height={32}
                                className={`w-6 h-6 object-contain filter invert ${isSelected ? "opacity-85" : "opacity-40"} hover:opacity-85`}
                                priority
                            />
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
