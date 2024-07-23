export interface AlarmTime {
    time: string;
    status: boolean;
}

export interface Alarm {
    id: string;
    userId: string;
    name: string;
    date: Date;
    times: AlarmTime[];
    message: string;
}