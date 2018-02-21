import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as moment from 'moment';
import { ErrorNotifyService } from '@shared/services/error-notify.service';

import { CAMPAIGN_INLINE_EDIT_ENDPOINT } from '@src/app/app.constant';

declare const toastr: any;

@Injectable()

export class InlineDurationEditService {

    loading = new BehaviorSubject(false);

    constructor(private http: HttpClient, private errorService: ErrorNotifyService) {
    }

    parseEditResponse(res: any, onSuccess: Function) {
        if (typeof res === 'object' && res.campaign && res.campaign.time_start && typeof  res.campaign_id !== 'undefined') {

            const timeStart = +moment(res.campaign.time_start, 'YYYY-MM-DD hh:mm:ss').format('X');
            const timeEnd = res.campaign.time_end ? +moment(res.campaign.time_end, 'YYYY-MM-DD hh:mm:ss').format('X') : 0;
            onSuccess(timeStart, timeEnd, res.campaign_id );
            toastr.success(res.success_msg);

        } else {
            this.onError();
        }
    }

    onError() {
        this.loading.next(false);
        this.errorService.show();
    }

    editDuration(startDate: string, endDate: string, campaignId: number, onSuccess: Function) {
        this.loading.next(true);

        this.http.post(CAMPAIGN_INLINE_EDIT_ENDPOINT, {
            start_date: startDate,
            end_date: endDate,
            id: campaignId
        }).toPromise()
            .then((res: any) => {
                this.parseEditResponse(res, onSuccess);
                this.loading.next(false);
            })
            .catch((err) => {
                console.log(err);
                this.onError();
            });
    }
}
