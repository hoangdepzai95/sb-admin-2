import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorNotifyService } from '@shared/services/error-notify.service';

declare const toastr: any;

@Injectable()

export class InlineStatusEditService {

    constructor(private http: HttpClient, private errorService: ErrorNotifyService) {
    }

    onError() {
        this.errorService.show();
    }

    singleEditStatus(endPoint: string, id: number, status: number, onSuccess: Function) {
        return this.http.post(endPoint, {
            status,
            id
        }).toPromise()
            .then((res: any) => {
                toastr.success(res.success_msg);
                onSuccess(res);
            })
            .catch((err) => {
                console.log(err);
                this.onError();
            });
    }
}
