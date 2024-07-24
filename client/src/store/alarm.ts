import create from 'zustand';

export interface Alarm {
  id?: string;
  userId?: string;
  startDate: string;
  endDate?: string;
  interval: number;
  message: string;
  time: string;
  alarmStatus?: boolean;
  name: string;
  frequency: string;
  times: string[];
}

interface AlarmState {
  alarms: Alarm[];
  setAlarms: (alarms: Alarm[]) => void;
  addAlarm: (alarm: Alarm) => void;
  updateAlarm: (updatedAlarm: Alarm) => void;
  deleteAlarm: (id: string) => void;
  currentPage: 'main' | 'settings' | 'edit';
  setCurrentPage: (page: 'main' | 'settings' | 'edit') => void;
  currentAlarm: Alarm | null;
  setCurrentAlarm: (alarm: Alarm | null) => void;
}

export const useAlarmStore = create<AlarmState>((set) => ({
  alarms: [],
  setAlarms: (alarms) => set({ alarms }),
  addAlarm: (alarm) =>
    set((state) => ({
      alarms: [
        ...state.alarms,
        { ...alarm, id: String(state.alarms.length + 1) }
      ]
    })),
  updateAlarm: (updatedAlarm) =>
    set((state) => ({
      alarms: state.alarms.map((alarm) =>
        alarm.id === updatedAlarm.id ? updatedAlarm : alarm
      )
    })),
  deleteAlarm: (id) =>
    set((state) => ({
      alarms: state.alarms.filter((alarm) => alarm.id !== id)
    })),
  currentPage: 'main',
  setCurrentPage: (page) => set({ currentPage: page }),
  currentAlarm: null,
  setCurrentAlarm: (alarm) => set({ currentAlarm: alarm })
}));
