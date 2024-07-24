import { create } from 'zustand';

interface Authentication {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  checkAuthentication: () => void;
}

export const useAuthentication = create<Authentication>((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  // 토큰 유무 확인
  checkAuthentication: () => {
    const token = localStorage.getItem('token');
    set({ isAuthenticated: !!token });
  }
}));
