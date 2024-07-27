import create from 'zustand'

interface PillState { 
  pillData: any | null;
  setPillData: (data: any)=> void;
}

export const usePillStore = create<PillState>((set) => ({
  pillData: null,
  setPillData: (data) => set({pillData:data}),
}))