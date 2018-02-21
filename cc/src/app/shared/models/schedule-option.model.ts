export class ScheduleOptionModel {
    label: string;
    value: string;
    from: number;
    to: number;
    selected?: boolean;
    inAllWorkingDay?: boolean;
    error?: boolean;
}
