import { Injectable } from '@angular/core';
import { LangService } from './lang/lang.service';

declare const toastr;

@Injectable()

export class AppConfigService {

    constructor(private langService: LangService) {
    }

    load(): Promise<any> {
        this.loadToastrConfig();
        return this.langService.init();
    }
    loadToastrConfig(): void {
        toastr.options = {
            'closeButton': true,
            'debug': false,
            'progressBar': false,
            'preventDuplicates': false,
            'positionClass': 'toast-top-center',
            'onclick': null,
            'showDuration': '400',
            'hideDuration': '1000',
            'timeOut': '7000',
            'extendedTimeOut': '1000',
            'showEasing': 'swing',
            'hideEasing': 'linear',
            'showMethod': 'fadeIn',
            'hideMethod': 'fadeOut'
        };
    }
}
