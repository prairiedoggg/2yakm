import { create } from 'zustand'

interface User {
  user: {
    userName: string;
    email: string;
    profileimg: string;
    id: string;
  } | null;
  setUser: (userName: string, email: string, profileimg: string, id: string) => void;
  setUserId: (id: string) => void;
  setProfileimg: (profileimg: string) => void;
  setUserName: (userName: string) => void;
  setEmail: (email: string) => void;
  clearUser: () => void;

}

const useUserStore = create<User>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  setUser: (userName, email, profileimg, id) => {
    const user = { userName, email, profileimg, id };
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
  setUserId: (id) => set((state) => {
    const updatedUser = state.user ? { ...state.user, id } : null;
    if (updatedUser) localStorage.setItem('user', JSON.stringify(updatedUser));
    return { user: updatedUser };
  }),
  setUserName: (userName) => set((state) => {
    const updatedUser = state.user ? { ...state.user, userName } : null;
    if (updatedUser) localStorage.setItem('user', JSON.stringify(updatedUser));
    return { user: updatedUser };
  }),
  setProfileimg: (profileImage) => set((state) => {
    const updatedUser = state.user ? { ...state.user, profileImage } : null;
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