/**
File Name : store.ts
Description : zustand store
Author : 임지영

History
Date        Author   Status    Description
2024.07.18  임지영   Created
*/

import { create } from 'zustand';

interface Store {
  value: Date;
  onChange: (date: Date) => void;
  edit: boolean;
  setEdit: () => void;
  arrow: boolean;
  setArrow: () => void;
}

// interface CalendarDetail {
//   title: string;
//   bloodSugar?: number[];
//   temp?: number;
//   weight?: number;
//   photo?: boolean;
// }

export const useDateStore = create<Store>((set) => ({
  value: new Date(),
  onChange: (date: Date) => set({ value: date }),
  edit: false,
  setEdit: () => set((state) => ({ edit: !state.edit })),
  arrow: false,
  setArrow: () => set((state) => ({ arrow: !state.arrow }))
}));

// export const useCalendarDetail = create<CalendarDetail>(() => ({}));
