'use client'

import { rustIcon, tsIcon } from "@/components/Icons";
import IDE from "@/components/IDE";
import { ExpandableSidebar, SidebarStrip } from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useState } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([
    { symbol: rustIcon, fname: "main.rs" },
    { symbol: rustIcon, fname: "constant.rs" },
    { symbol: rustIcon, fname: "error.rs" },
  ]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex h-screen">
      <SidebarStrip toggleSidebar={toggleSidebar} />
      <ExpandableSidebar isOpen={isOpen} onCreateFile={() => {
        setData([...data, { symbol: tsIcon, fname: "index.ts" }]);
      }} />
      <div className="flex-1 overflow-auto min-w-0 flex flex-col" style={{ marginLeft: isOpen ? '20rem' : 0 }}>
        <Topbar files={data} onClose={(i) => {
          setData((prevData) => prevData.filter((_, idx) => idx !== i));
        }} />
        <IDE />
      </div>
    </div>
  );
}
