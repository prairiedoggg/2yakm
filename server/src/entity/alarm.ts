export interface AlarmTime {
    time: string;
}

export interface Alarm {
    id: string;
    userId: string;
    name: string;
    startDate: Date;
    endDate: Date;
    times: AlarmTime[];
    alarmStatus: boolean; 
}