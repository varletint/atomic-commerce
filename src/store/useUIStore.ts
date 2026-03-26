import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  toggleSidebar: () => void;
  toggleCart: () => void;
  toggleMobileMenu: () => void;
  toggleSearch: () => void;
  openCart: () => void;
  closeCart: () => void;
  closeAll: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isCartOpen: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  closeAll: () =>
    set({
      isSidebarOpen: false,
      isCartOpen: false,
      isMobileMenuOpen: false,
      isSearchOpen: false,
    }),
}));
