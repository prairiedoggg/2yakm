import { create } from 'zustand';

interface Store {
  value: Date;
  onChange: (date: Date) => void;
  edit: boolean;
  setEdit: () => void;
  arrow: boolean;
  setArrow: () => void;
}

interface Calendar {
  pillName?: string[];
  time?: string[][];
  isPillTaken?: boolean[][];
  bloodSugar?: number[];
  temp?: number;
  weight?: number;
  photo?: boolean;
  imgUrl?: string;
  setPillName: (pillName: string[]) => void;
  setTime: (time: string[][]) => void;
  setIsPillTaken: (isPillTaken: boolean[][]) => void;
  setBloodSugar: (bloodSugar: number[]) => void;
  setTemp: (temp: number) => void;
  setWeight: (weight: number) => void;
  setPhoto: (photo: boolean) => void;
  setImgUrl: (imgUrl: string) => void;
}

export const useDateStore = create<Store>((set) => ({
  value: new Date(),
  onChange: (date: Date) => set({ value: date }),
  edit: false,
  setEdit: () => set((state) => ({ edit: !state.edit })),
  arrow: false,
  setArrow: () => set((state) => ({ arrow: !state.arrow }))
}));

export const useCalendar = create<Calendar>((set) => ({
  pillName: [],
  time: [],
  isPillTaken: [],
  bloodSugar: [0, 0],
  temp: 0,
  weight: 0,
  photo: false,
  imgUrl: '',
  setPillName: (pillName) => set({ pillName }),
  setTime: (time) => set({ time }),
  setIsPillTaken: (isPillTaken) => set({ isPillTaken }),
  setBloodSugar: (bloodSugar) => set({ bloodSugar }),
  setTemp: (temp) => set({ temp }),
  setWeight: (weight) => set({ weight }),
  setPhoto: (photo) => set({ photo }),
  setImgUrl: (imgUrl) => set({ imgUrl })
}));
