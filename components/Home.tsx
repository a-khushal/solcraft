'use client'

import { useSidebar, useSidebarSync } from "@/hooks/useSidebar";
import SidebarStrip from "./Sidebar/SidebarStrip";
import ExpandableSidebar from "./Sidebar/ExpandableSidebar";
import IDE from "./IDE";
import Topbar from "./Topbar";

export default function Home() {
  useSidebarSync();
  const isOpen = useSidebar((state: { isOpen: boolean }) => state.isOpen);

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
