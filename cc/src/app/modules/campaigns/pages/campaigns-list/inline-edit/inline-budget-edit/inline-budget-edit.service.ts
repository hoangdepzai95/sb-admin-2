import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorNotifyService } from '@shared/services/error-notify.service';
import { CAMPAIGN_INLINE_EDIT_ENDPOINT } from '@src/app/app.constant';

declare const toastr: any;

@Injectable()

export class InlineBudgetEditService {

    loading = new BehaviorSubject(false);

    constructor(private http: HttpClient, private errorService: ErrorNotifyService) {
    }

    private onError() {
        this.errorService.show();
    }

    changeBudget(campaignId: number, budget: number | string, onSuccess: Function) {
        this.loading.next(true);

        this.http.post(CAMPAIGN_INLINE_EDIT_ENDPOINT, {
            spendings_limit: budget,
            campaignId
        }).toPromise()
            .then((res: any) => {
                this.loading.next(false);

                if (typeof res === 'object' && res.campaign) {
                    onSuccess(res);
                    toastr.success(res.success_msg);
                } else {
                    this.onError();
                }
            })
            .catch((err) => {
                console.log(err);
                this.loading.next(false);
                this.onError();
            });
    }

}
