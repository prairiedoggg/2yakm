export interface Alarm {
    id: string;
    userId: string;
    name: string;
    date: Date;
    times: string[];
    message: string;
    alarmStatus: boolean;
}