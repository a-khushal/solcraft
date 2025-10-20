import { Folder, Hammer, FlaskConical } from "lucide-react";

export function SidebarStrip({ toggleSidebar }: { toggleSidebar: () => void }) {
    const buttons = [
        { title: 'Explorer', icon: <Folder width={26} height={26} color="#bbb" /> },
        { title: 'Build', icon: <Hammer width={26} height={26} color="#bbb" /> },
        { title: 'Test', icon: <FlaskConical width={26} height={26} color="#bbb" /> },
    ];

    return (
        <div className="h-screen flex flex-col items-center pt-2 box-border border-r border-neutral-700 bg-[#1e1e1e] w-[52px]">
            {buttons.map((btn) => (
                <button
                    key={btn.title}
                    className="bg-none border-none my-3 p-0 cursor-pointer flex items-center justify-center hover:opacity-75 transition-opacity"
                    title={btn.title}
                    type="button"
                    onClick={toggleSidebar}
                >
                    {btn.icon}
                </button>
            ))}
        </div>
    );
}

export function ExpandableSidebar({ isOpen }: { isOpen: boolean }) {
    if (!isOpen) return null;
    return (
        <div
            className="fixed top-0 left-[52px] z-20 h-screen w-[20rem] bg-neutral-900 border-r border-neutral-700"
        >
        </div>
    );
}