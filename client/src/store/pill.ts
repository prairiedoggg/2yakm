import { create } from 'zustand';

export interface PillData {
  imgurl:string;
  id: number;
  name: string;
  engname: string;
  companyname: string;
  importantWords: string;
  ingredientname: string;
  efficacy: string;
  dosage: string;
  caution: string;
  source: string;
}

interface PillState {
  pillData: PillData | null;
  setPillData: (data: PillData | null) => void;
}

export const usePillStore = create<PillState>((set) => ({
  pillData: null,
  setPillData: (data: PillData | null) => set({ pillData: data })
}));
