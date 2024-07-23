import create from 'zustand';

interface Authentication {
  code?: string;
  setCode: (code: string) => void;
  token: string;
  setToken: (token: string) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useAuthentication = create<Authentication>((set) => ({
  code: '',
  setCode: (code) => set({ code }),
  token: '',
  setToken: (token) => set({ token }),
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated })
}));
