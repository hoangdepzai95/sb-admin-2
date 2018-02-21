import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()

export class  DateRangeService {

    private period = new BehaviorSubject(this.getSavedPeriod());

    constructor(private translate: TranslateService) {
    }

    private getSavedPeriod(): string {
        return localStorage.getItem('campaign_list_period') || 'total';
    }

    setPeriod(period: string) {
        localStorage.setItem('campaign_list_period', period);
        this.period.next(this.getSavedPeriod());
    }

    private formatDate(date: moment.Moment): string {
        return date.format('DD.MM.YYYY');
    }

    getPeriod(): Observable<string> {
        return this.period.asObservable();
    }

    get dateRangeOptions () {
        return [
            {
                value: 'total',
                label: 'campaignsList.All time'
            },
            {
                value: 'today',
                label: `${this.translate.instant('common.Today')} (${this.formatDate(moment())})`,
                noTranslate: true
            },
            {
                value: 'yesterday',
                label: `${this.translate.instant('common.Yesterday')}  (${this.formatDate(moment().subtract(1, 'days'))})`,
                noTranslate: true
            },
            {
                value: 'week',
                label: `
                    ${this.translate.instant('common.Last 7 days')}
                    (${this.formatDate(moment().subtract(6, 'days'))} - ${this.formatDate(moment())})
                    `,
                noTranslate: true
            },
            {
                value: 'month',
                label: `
                    ${this.translate.instant('common.Last 30 days')}
                    (${this.formatDate(moment().subtract(29, 'days'))} - ${this.formatDate(moment())})`,
                noTranslate: true
            }
        ];
    }
}
