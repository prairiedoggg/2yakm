import { create } from 'zustand';

export interface Pill {
  pillid: string;
  pillname: string;
  expiredat?: string;
  alarmstatus?: boolean;
}

interface MyPillState {
  pills: Pill[];
  setPills: (pills: Pill[]) => void;
  addPill: (pill: Pill) => void;
  addPills: (pills: Pill[]) => void;
  deletePill: (id: string) => void;
}

export const useMyPillStore = create<MyPillState>((set) => ({
  pills: [],
  setPills: (pills) => set({ pills }),

  addPill: (pill) => set((state) => {
    const existingPillIds = new Set(state.pills.map(p => p.pillid));
    if (!existingPillIds.has(pill.pillid)) {
      return {
        pills: [...state.pills, pill],
      };
    }
    return state;
  }),

  addPills: (pills) => set((state) => {
    const existingPillIds = new Set(state.pills.map(pill => pill.pillid));
    const newPills = pills.filter(pill => !existingPillIds.has(pill.pillid));

    return {
      pills: [...state.pills, ...newPills],
    };
  }),
  
  deletePill: (id: string) =>
  set((state) => ({
    pills: state.pills.filter((pill) => pill.pillid !== id)
  })),
}));
