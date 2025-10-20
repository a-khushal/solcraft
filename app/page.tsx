'use client'

import IDE from "@/components/IDE";
import { ExpandableSidebar, SidebarStrip } from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useSidebar } from "@/hooks/useSidebar";

export default function Home() {
  const isOpen = useSidebar((state: any) => state.isOpen);

  return (
    <div className="flex h-screen">
      <SidebarStrip />
      <ExpandableSidebar />
      <div className="flex-1 overflow-auto min-w-0 flex flex-col" style={{ marginLeft: isOpen ? '20rem' : 0 }}>
        <Topbar />
        <IDE />
      </div>
    </div>
  );
}
