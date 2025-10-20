import { create } from 'zustand';
import { useEffect } from 'react';
import { SIDEBAR_OPEN_KEY } from '@/lib/constants';

export const useSidebar = create((set) => ({
    isOpen: false,
    toggleSidebar: () => set((state: any) => {
        const newOpen = !state.isOpen;
        if (typeof window !== 'undefined') {
            localStorage.setItem(SIDEBAR_OPEN_KEY, String(newOpen));
        }
        return { isOpen: newOpen };
    }),
}));

export const useSidebarSync = () => {
    useEffect(() => {
        const stored = localStorage.getItem(SIDEBAR_OPEN_KEY);
        if (stored !== null) {
            useSidebar.setState({ isOpen: stored === 'true' });
        }
    }, []);
};
