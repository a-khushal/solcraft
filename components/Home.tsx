'use client'

import { useSidebar, useSidebarSync } from "@/hooks/useSidebar";
import { useWorkspace } from "@/hooks/useWorkspace";
import SidebarStrip from "./Sidebar/SidebarStrip";
import ExpandableSidebar from "./Sidebar/ExpandableSidebar";
import IDE from "./IDE";
import Topbar from "./Topbar";
import { useEffect, useState } from "react";

export default function Home() {
  const [isInitialized, setIsInitialized] = useState(false);
  const loadWorkspace = useWorkspace((state: any) => state.loadWorkspace);
  const isLoading = useWorkspace((state: any) => state.isLoading);
  const error = useWorkspace((state: any) => state.error);
  const clearError = useWorkspace((state: any) => state.clearError);

  useEffect(() => {
    async function initialize() {
      try {
        await loadWorkspace('workspace1');
      } catch (error) {
        console.error('Error loading workspace:', error);
      } finally {
        setIsInitialized(true);
      }
    }

    initialize();
  }, [loadWorkspace]);

  useSidebarSync();
  const isOpen = useSidebar((state: { isOpen: boolean }) => state.isOpen);

  if (!isInitialized || isLoading) {
    return <div className="w-full h-screen bg-white" />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">Error: {error}</div>
          <button
            onClick={clearError}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
