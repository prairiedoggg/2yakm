export interface Alarm {
    id: string;
    userId: string;
    startDate: Date;
    endDate: Date;
    time: string;
    interval: number;
    message:string;
    alarmContent: string;
    alarmStatus: boolean;
}