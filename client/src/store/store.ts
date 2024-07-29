import { create } from 'zustand';

interface Store {
  value: Date;
  onChange: (date: Date) => void;
  edit: boolean;
  setEdit: () => void;
  arrow: boolean;
  setArrow: () => void;
}

export const useDateStore = create<Store>((set) => ({
  value: new Date(),
  onChange: (date: Date) => set({ value: date }),
  edit: false,
  setEdit: () => set((state) => ({ edit: !state.edit })),
  arrow: false,
  setArrow: () => set((state) => ({ arrow: !state.arrow }))
}));

interface PillData {
  name?: string;
  time?: string | string[];
  taken?: boolean | boolean[];
}

interface Calendar {
  pillData?: PillData[];
  bloodsugarbefore?: number | null;
  bloodsugarafter?: number | null;
  temp?: number | null;
  weight?: number | null;
  photo?: string | null;
  setPillData: (pillData: PillData[]) => void;
  setBloodSugarBefore: (bloodsugarbefore: number | null) => void;
  setBloodSugarAfter: (bloodsugarafter: number | null) => void;
  setTemp: (temp: number | null) => void;
  setWeight: (weight: number | null) => void;
  setPhoto: (photo: string | null) => void;
}

export const useCalendar = create<Calendar>((set) => ({
  pillData: [],
  bloodsugarbefore: null,
  bloodsugarafter: null,
  temp: null,
  weight: null,
  photo: null,
  setPillData: (pillData) => set({ pillData }),
  setBloodSugarBefore: (bloodsugarbefore) => set({ bloodsugarbefore }),
  setBloodSugarAfter: (bloodsugarafter) => set({ bloodsugarafter }),
  setTemp: (temp) => set({ temp }),
  setWeight: (weight) => set({ weight }),
  setPhoto: (photo) => set({ photo })
}));
