import { create } from 'zustand';

interface Store {
  value: Date;
  onChange: (date: Date) => void;
  edit: boolean;
  setEdit: (edit: boolean) => void;
  arrow: boolean;
  setArrow: () => void;
  neverPost: boolean;
  setNeverPost: (neverPost: boolean) => void;
}

export const useDateStore = create<Store>((set) => ({
  value: new Date(),
  onChange: (date: Date) => set({ value: date }),
  edit: false,
  setEdit: (edit) => set({ edit }),
  arrow: false,
  setArrow: () => set((state) => ({ arrow: !state.arrow })),
  neverPost: true,
  setNeverPost: (neverPost) => set({ neverPost })
}));

interface PillData {
  name?: string;
  time?: string | string[];
  taken?: boolean | boolean[];
}

interface CalendarData {
  pillData?: PillData[];
  bloodsugarbefore?: number | null;
  bloodsugarafter?: number | null;
  temp?: number | null;
  weight?: number | null;
  photo?: string | null;
}

interface Calendar {
  calendarData: CalendarData | null;
  calImg?: FormData | null;
  setCalendarData: (calendarData: CalendarData | null) => void;
  setPillData: (pillData: PillData[]) => void;
  setBloodSugarBefore: (bloodsugarbefore: number | null) => void;
  setBloodSugarAfter: (bloodsugarafter: number | null) => void;
  setTemp: (temp: number | null) => void;
  setWeight: (weight: number | null) => void;
  setPhoto: (photo: string | null) => void;
  setCalImg: (calImg: FormData) => void;
}

export const useCalendar = create<Calendar>((set) => ({
  calendarData: null,
  setCalendarData: (calendarData) => set({ calendarData }),

  setPillData: (pillData) =>
    set((state) => ({
      calendarData: {
        ...state.calendarData,
        pillData
      }
    })),

  setBloodSugarBefore: (bloodsugarbefore) =>
    set((state) => ({
      calendarData: {
        ...state.calendarData,
        bloodsugarbefore
      }
    })),

  setBloodSugarAfter: (bloodsugarafter) =>
    set((state) => ({
      calendarData: {
        ...state.calendarData,
        bloodsugarafter
      }
    })),

  setTemp: (temp) =>
    set((state) => ({
      calendarData: {
        ...state.calendarData,
        temp
      }
    })),

  setWeight: (weight) =>
    set((state) => ({
      calendarData: {
        ...state.calendarData,
        weight
      }
    })),

  setPhoto: (photo) =>
    set((state) => ({
      calendarData: {
        ...state.calendarData,
        photo
      }
    })),

  calImg: new FormData(),
  setCalImg: (formData) =>
    set(() => ({
      calImg: formData
    }))
}));
