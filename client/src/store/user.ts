import { create } from 'zustand'
//persist 사용하기.

interface User {
  user: {
    userName: string;
    email: string;
    profileImg: string;
    id: string;
    role: boolean;
  } | null;
  userToken: {
    token: string;
    refreshToken: string;
  };
  setToken: (token: string, refreshToken: string) => void;
  setUser: (
    userName: string,
    email: string,
    profileImg: string,
    id: string,
    role: boolean
  ) => void;
  setUserId: (id: string) => void;
  setProfileImg: (profileImg: string) => void;
  setUserName: (userName: string) => void;
  setEmail: (email: string) => void;
  setRole: (role: boolean) => void;
  clearUser: () => void;
}

const useUserStore = create<User>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  userToken: {
    token: localStorage.getItem('token') || '',
    refreshToken: localStorage.getItem('refreshToken') || ''
  },

  setToken: (token, refreshToken) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    set(() => ({
      userToken: { token, refreshToken }
    }));
  },

  setUser: (userName, email, profileImg, id, role) => {
    const user = { userName, email, profileImg, id, role };
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  setUserId: (id) =>
    set((state) => {
      const updatedUser = state.user ? { ...state.user, id } : null;
      if (updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    }),
    setRole: (role) =>
      set((state) => {
        const updatedUser = state.user ? { ...state.user, role } : null;
        if (updatedUser)
          localStorage.setItem('user', JSON.stringify(updatedUser));
        return { user: updatedUser };
      }),
  setUserName: (userName) =>
    set((state) => {
      const updatedUser = state.user ? { ...state.user, userName } : null;
      if (updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    }),
  setProfileImg: (profileImg) =>
    set((state) => {
      const updatedUser = state.user ? { ...state.user, profileImg } : null;
      if (updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    }),
  setEmail: (email) =>
    set((state) => {
      const updatedUser = state.user ? { ...state.user, email } : null;
      if (updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    }),
  clearUser: () => {
    localStorage.removeItem('user');
    set({ user: null });
  }
}));

export default useUserStore;
