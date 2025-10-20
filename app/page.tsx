'use client'

import IDE from "@/components/IDE";
import { ExpandableSidebar, SidebarStrip } from "@/components/Sidebar";
import { useState } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex h-screen">
      <SidebarStrip toggleSidebar={toggleSidebar} />
      <ExpandableSidebar isOpen={isOpen} />
      <div className="flex-1 overflow-auto min-w-0" style={{ marginLeft: isOpen ? '20rem' : 0 }}>
        <IDE />
      </div>
    </div>
  );
}
