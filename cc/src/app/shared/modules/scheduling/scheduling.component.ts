import { Component } from '@angular/core';
import { DAY_OF_WEEK } from '@shared/static-data/day-of-week.data';
import { HOUR_RANGES } from '@shared/modules/scheduling/scheduling.constant';
import { ScheduleModel } from '@shared/models/schedule.model';

@Component({
    selector: 'ad-scheduling',
    templateUrl: './scheduling.template.html'
})

export class SchedulingComponent {

    DAY_OF_WEEK = DAY_OF_WEEK;

    HOUR_RANGES = HOUR_RANGES ;

    scheduleList: Array<ScheduleModel> = [];

    toggleSchedule(day: number, hour: number) {
        if (this.isSelected(day, hour)) {
            this.scheduleList = this.scheduleList.filter(schedule => !(schedule.day === day && schedule.hour === hour));
        } else {
            this.scheduleList = [...this.scheduleList, { day, hour }];
        }
    }

    isSelected(day: number, hour: number): boolean {
        return !!this.scheduleList.find(schedule => schedule.day === day && schedule.hour === hour);
    }

    isSelectedEveryDay(hour: number): boolean {
        return this.scheduleList.filter((schedule: ScheduleModel) => schedule.hour === hour).length === 7;
    }

    toggleSelectEveryDay(hour: number) {

        const selected = this.isSelectedEveryDay(hour);
        this.scheduleList = this.scheduleList.filter((schedule: ScheduleModel) => schedule.hour !== hour);
        if (!selected) {
            this.scheduleList = [...this.scheduleList, ...DAY_OF_WEEK.map(day =>  ({ hour, day: day.value }))];
        }
    }

}
