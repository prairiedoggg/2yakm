import create from 'zustand';

export interface Alarm {
  name: string;
  frequency: string;
  times: string[];
}

interface AlarmState {
  alarms: Alarm[];
  addAlarm: (alarm: Alarm) => void;
  removeAlarm: (index: number) => void;
  updateAlarm: (index: number, updatedAlarm: Alarm) => void;
  currentPage: 'main' | 'settings' | 'edit';
  setCurrentPage: (page: 'main' | 'settings' | 'edit') => void;
  currentAlarm: Alarm | null;
  setCurrentAlarm: (alarm: Alarm | null) => void;
}

export const useAlarmStore = create<AlarmState>((set) => ({
  alarms: [],
  addAlarm: (alarm) => set((state) => ({ alarms: [...state.alarms, alarm] })),
  removeAlarm: (index) =>
    set((state) => ({
      alarms: state.alarms.filter((_, i) => i !== index)
    })),
  updateAlarm: (index, updatedAlarm) =>
    set((state) => ({
      alarms: state.alarms.map((alarm, i) =>
        i === index ? updatedAlarm : alarm
      )
    })),
  currentPage: 'main',
  setCurrentPage: (page) => set({ currentPage: page }),
  currentAlarm: null,
  setCurrentAlarm: (alarm) => set({ currentAlarm: alarm })
}));
