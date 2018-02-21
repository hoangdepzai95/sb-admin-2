import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

declare const toastr: any;

@Injectable()

export class ErrorNotifyService {

    constructor(private translate: TranslateService) {
    }

    show() {
        toastr.error(this.translate.instant('common.Data handler exception. Please, refresh the page and retry.'));
    }

}
