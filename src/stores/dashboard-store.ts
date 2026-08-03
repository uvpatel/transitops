import { create } from "zustand";

interface DashboardState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  activeOrganizationId: string | null;
  setActiveOrganizationId: (orgId: string | null) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  
  activeOrganizationId: null,
  setActiveOrganizationId: (orgId) => set({ activeOrganizationId: orgId }),

  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
