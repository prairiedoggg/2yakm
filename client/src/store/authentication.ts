import { create } from 'zustand';

interface Authentication {
  isAuthenticated: boolean;
  checkAuthentication: () => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useAuthentication = create<Authentication>((set) => ({
  isAuthenticated: false,
  checkAuthentication: () => {
    const token = localStorage.getItem('token');
    set({ isAuthenticated: !!token });
  },
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated })
}));
