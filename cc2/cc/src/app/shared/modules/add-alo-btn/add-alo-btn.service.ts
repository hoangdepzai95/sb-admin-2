import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ALO_COCCOC_ENDPOINT } from '@src/app/app.constant';
import { ErrorNotifyService } from '@shared/services/error-notify.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { AloBtnModel } from '@shared/models/alo-btn.model';
import { DropdownOptionsModel } from '@shared/models/dropdown-options.model';
import { ScheduleOptionModel } from '@shared/models/schedule-option.model';

declare const toastr: any;

@Injectable()

export class AddAloBtnService {

    private loading = new BehaviorSubject<boolean>(false);

    private aloBtnList = new BehaviorSubject<AloBtnModel[]>([]);

    private scheduleOptions = new BehaviorSubject<ScheduleOptionModel[]>([
        {
            label: 'common.Monday',
            value: 'monday',
            from: 9 * 3600,
            to: (18 * 3600) - 1,
            selected: true
        },
        {
            label: 'common.Monday/Friday',
            value: 'monday/friday',
            from: 9 * 3600,
            to: (18 * 3600) - 1,
            selected: true,
            inAllWorkingDay: true
        },
        {
            label: 'common.Tuesday',
            value: 'tuesday',
            from: 9 * 3600,
            to: (18 * 3600) - 1,
            selected: true
        },
        {
            label: 'common.Wednesday',
            value: 'wednesday',
            from: 9 * 3600,
            to: (18 * 3600) - 1,
            selected: true
        },
        {
            label: 'common.Thursday',
            value: 'thursday',
            from: 9 * 3600,
            to: (18 * 3600) - 1,
            selected: true
        },
        {
            label: 'common.Friday',
            value: 'friday',
            from: 9 * 3600,
            to: (18 * 3600) - 1,
            selected: true
        },
        {
            label: 'common.Saturday',
            value: 'saturday',
            from: 9 * 3600,
            to: (18 * 3600) - 1,
            inAllWorkingDay: true
        },
        {
            label: 'common.Sunday',
            value: 'sunday',
            from: 9 * 3600,
            to: (18 * 3600) - 1,
            inAllWorkingDay: true
        },
        {
            label: 'common.Lunch time',
            value: 'lunch',
            from: 12 * 3600,
            to: (14 * 3600) - 1,
            selected: true,
            inAllWorkingDay: true
        }
    ]);

    constructor(private http: HttpClient, private errorService: ErrorNotifyService) {
    }

    getLoading(): Observable<boolean> {
        return this.loading.asObservable();
    }

    getAloButtons(): Observable<AloBtnModel[]> {
        return this.aloBtnList.asObservable();
    }

    setAloButtons(aloButtons: AloBtnModel[]) {
        this.aloBtnList.next(aloButtons);
    }

    getAloBtnOptions(aloButtons: AloBtnModel[]) {
        return aloButtons.map((button: AloBtnModel) => {
            button.label = button.name;
            return button;
        });
    }

    getAloBtnList() {

        this.loading.next(true);

        this.http.get(ALO_COCCOC_ENDPOINT)
            .toPromise()
            .then((res) => {
                if (Array.isArray(res)) {
                    this.aloBtnList.next(res);
                } else {
                    this.errorService.show();
                }
                this.loading.next(false);
            })
            .catch(() => {
                this.errorService.show();
                this.loading.next(false);
            });
    }

    get fromTimeOptions(): DropdownOptionsModel {

        return Array(23).fill(0).map((value, i) => {
            return {
                label: i < 10 ? `0${i}:00` : `${i}:00`,
                value: i * 3600
            };
        });
    }

    get toTimeOptions(): DropdownOptionsModel {

        return Array(23).fill(0).map((value, i) => {
            return {
                label: i < 10 ? `0${i}:59` : `${i}:59`,
                value: (i * 3600) - 1
            };
        });
    }

    getScheduleOptions(): Observable<ScheduleOptionModel[]> {
        return this.scheduleOptions.asObservable();
    }

    getScheduleOptionsValue(
        allWorkingDay: boolean,
        scheduleOptions: ScheduleOptionModel[] = this.scheduleOptions.getValue()
    ): ScheduleOptionModel[] {
        if (allWorkingDay) {
            return scheduleOptions.filter(option => option.inAllWorkingDay);
        } else {
            return scheduleOptions.filter(option => option.value !== 'monday/friday');
        }
    }

    changeSchedule(value: string, field: string, data: any) {
        const scheduleOptions = this.scheduleOptions.getValue();

        scheduleOptions.map((scheduleOption: ScheduleOptionModel) => {
            if (scheduleOption.value === value) {
                scheduleOption[field] = data;
                if (scheduleOption.from > scheduleOption.to) {
                    scheduleOption.error = true;
                } else {
                    scheduleOption.error = false;
                }
            }
            return scheduleOption;
        });

        this.scheduleOptions.next(scheduleOptions);
    }

    createNewButton(): Promise<any> {
        return this.http.post(ALO_COCCOC_ENDPOINT, {})
            .toPromise()
            .then(() => {
                toastr.success('New button created');
            })
            .catch(() => {
                this.errorService.show();
            });
    }

}
