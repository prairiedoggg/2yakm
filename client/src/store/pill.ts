import create from 'zustand';

interface PillData {
  id: number;
  name: string;
  engname: string;
  companyname: string;
  ingredientname: string;
  efficacy: string;
  importantWords: string;
}


interface PillState {
  pillData: PillData | null;
  setPillData: (data: PillData | null) => void;
}

export const usePillStore = create<PillState>((set) => ({
  pillData: null,
  setPillData: (data: PillData | null) => set({ pillData: data })
}));
