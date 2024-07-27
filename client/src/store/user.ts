import { create } from 'zustand'

interface User {
  user: {
    userName: string;
    email: string;
  } | null;
  setUser: (userName: string, email: string) => void;
  setUserName: (userName: string) => void;
  setEmail: (email: string) => void;
  clearUser: () => void;
}

const useUserStore = create<User>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  setUser: (userName, email) => {
    const user = { userName, email };
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
  setUserName: (userName) => set((state) => {
    const updatedUser = state.user ? { ...state.user, userName } : null;
    if (updatedUser) localStorage.setItem('user', JSON.stringify(updatedUser));
    return { user: updatedUser };
  }),
  setEmail: (email) => set((state) => {
    const updatedUser = state.user ? { ...state.user, email } : null;
    if (updatedUser) localStorage.setItem('user', JSON.stringify(updatedUser));
    return { user: updatedUser };
  }),
  clearUser: () => {
    localStorage.removeItem('user');
    set({ user: null });
  },
}));

export default useUserStore;