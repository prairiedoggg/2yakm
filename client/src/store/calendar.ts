import { create } from 'zustand';

interface Store {
  value: Date | null;
  onChange: (date: Date | null) => void;
  edit: boolean;
  setEdit: (edit: boolean) => void;
  arrow: boolean;
  setArrow: (arrow: boolean) => void;
  editTaken: boolean;
  setEditTaken: (editTaken: boolean) => void;
  addTaken: boolean;
  setAddTaken: (addTaken: boolean) => void;
  posted: Array<{ date?: string; post?: boolean }>;
  addPosted: (newPost: { date: string; post: boolean }) => void;
  setPosted: (date: string, post: boolean) => void;
  removePostedByDate: (date: string) => void;
}

export const useDateStore = create<Store>((set) => ({
  value: new Date(),
  onChange: (date: Date | null) => set({ value: date }),
  edit: false,
  setEdit: (edit) => set({ edit }),
  arrow: false,
  setArrow: (arrow) => set({ arrow }),
  editTaken: false,
  setEditTaken: (editTaken) => set({ editTaken }),
  addTaken: false,
  setAddTaken: (addTaken) => set({ addTaken }),
  posted: [],
  addPosted: (newPost) =>
    set((state) => {
      const exists = state.posted.some((item) => item.date === newPost.date);
      if (!exists) {
        return {
          posted: [...state.posted, newPost]
        };
      } else {
        return state;
      }
    }),
  setPosted: (date, post) =>
    set((state) => ({
      posted: state.posted.map((item) =>
        item.date === date ? { ...item, post } : item
      )
    })),
  removePostedByDate: (date) =>
    set((state) => ({
      posted: state.posted.filter((item) => item.date !== date)
    }))
}));

interface PillData {
  name?: string | null;
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
  setPillData: (pillData: PillData[] | null) => void;
  addPillData: (newPillData: PillData) => void;
  updatePillData: (newPillData: PillData) => void;
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
        pillData: pillData || []
      }
    })),

  addPillData: (newPillData) =>
    set((state) => ({
      calendarData: {
        ...state.calendarData,
        pillData: [...(state.calendarData?.pillData || []), newPillData]
      }
    })),

  updatePillData: (newPillData) =>
    set((state) => ({
      calendarData: {
        ...state.calendarData,
        pillData: state.calendarData?.pillData?.map((pill) =>
          pill.name === newPillData.name ? newPillData : pill
        ) || [newPillData] // 빈 배열로 초기화
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

  calImg: null,
  setCalImg: (formData) =>
    set(() => ({
      calImg: formData
    }))
}));
