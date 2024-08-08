import { create } from 'zustand';

export interface Pill {
  id: string;
  name: string;
  createdat?: string;
  expiredat?: string;
  alarmStatus?: boolean;
}

interface MyPillState {
  pills: Pill[];
  setPills: (pills: Pill[]) => void;
  addPill: (pill: Pill) => void;
  deletePill: (id: string) => void;
}

export const useMyPillStore = create<MyPillState>((set) => ({
  pills: [],
  setPills: (pills) => set({ pills }),
  addPill: (pill) =>
    set((state) => ({
      pills: [
        ...state.pills,
        { ...pill, id: String(state.pills.length + 1) }
      ]
    })),
    deletePill: (id: string) =>
    set((state) => ({
      pills: state.pills.filter((pill) => pill.id !== id)
    })),
}));
