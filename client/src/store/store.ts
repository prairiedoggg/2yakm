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
}

export const useDateStore = create<Store>((set) => ({
  value: new Date(),
  onChange: (date: Date) => set({ value: date })
}));
