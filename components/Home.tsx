'use client'

import { useSidebar, useSidebarSync } from "@/hooks/useSidebar";
import { ExpandableSidebar, SidebarStrip } from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import IDE from "@/components/IDE";

export default function Home() {
  useSidebarSync();
  const isOpen = useSidebar((state: any) => state.isOpen);

  return (
    <>
      <SidebarStrip />
      <ExpandableSidebar />
      <div className="flex-1 overflow-auto min-w-0 flex flex-col" style={{ marginLeft: isOpen ? '20rem' : 0 }}>
        <Topbar />
        <IDE />
      </div>
    </>
  );
}
