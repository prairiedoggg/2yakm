export interface AlarmTime {
    time: string;
    status: boolean;
}

export interface Alarm {
    id: string;
    userId: string;
    name: string;
    startDate: Date;
    endDate: Date;
    times: AlarmTime[];
    message: string;
    frequency: number;
}