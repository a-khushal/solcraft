import { create } from 'zustand'

export const useSidebar = create((set) => ({
    isOpen: false,
    toggleSidebar: () => set((state: any) => ({ isOpen: !state.isOpen })),
}))
