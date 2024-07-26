export interface Medication {
    time: string;
    taken: boolean;
}

export interface Calendar {
    id: string;
    userId: string;
    date: Date;
    calImg: string;
    condition: string;
    weight: number;
    temperature: number;
    bloodsugarBefore: number;
    bloodsugarAfter: number;
    medications: Medication[];
}