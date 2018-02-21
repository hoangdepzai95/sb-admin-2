import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';

declare const toastr: any;

@Injectable()

export class MultiStatusEditService {

    constructor(private http: HttpClient, private translate: TranslateService) {
    }

    onError() {
        toastr.error(this.translate.instant('common.Data handler exception. Please, refresh the page and retry.'));
    }

    multiEditStatus = (endPoint: string, ids: Array<number>, status: number, isEditAll: boolean, filter: any) => {
        return this.http.post(endPoint, {
            fields: { status },
            where: isEditAll ? { filter } : { id: ids }
        })
            .toPromise()
            .then(() => {
                toastr.success(
                    this.translate.instant(
                        'common.Please wait while your changes are updated in our system. This can take up to 10 minutes.'
                    ),
                    { timeOut: 3000 }
                );
            }).catch(() => {
                this.onError();
            });
    }
}
