import { create } from 'zustand';

interface Authentication {
  token: string;
  setToken: (token: string) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useAuthentication = create<Authentication>((set) => ({
  token: '',
  setToken: (token) => set({ token }),
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated })
}));
