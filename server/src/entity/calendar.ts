export interface Calendar {
    id: string;
    userId: string;
    date: Date;
    calImg: string;
    condition: string;
    weight: number;
    temperature: number;
    bloodsugar: number;
    alarm: Date;
}