import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { setCookie, getCookie, getUrlParam } from '@src/app/app.utils';
import { DEFAULT_LANG } from '@src/app/app.constant';

@Injectable()

export class LangService {
    private lang: string;

    constructor(private translateService: TranslateService) {
    }

    init(): Promise<any> {

        const langParam = getUrlParam('lang');

        if (langParam) {
            this.lang = this.transformLangKey(langParam);
            setCookie('lang', this.lang === 'vi' ? 'vi-VN' : 'en-US', 100, '/');
        } else {
            this.lang = this.transformLangKey(getCookie('lang'));
        }

        moment.locale(this.lang);

        return new Promise((resolve, reject) => {
            this.translateService.use(this.lang).subscribe(() => {
            }, (err) => {
                reject(err);
            }, () => {
                resolve(null);
            });
        });
    }
    changeLang(): void {
        setCookie('lang', this.lang === 'vi' ? 'en-US' : 'vi-VN', 100, '/');
        window.location.reload();
    }

    transformLangKey(lang: string): string {
        if (lang === 'vi-VN') {
            return 'vi';
        }

        if (lang === 'en-US') {
            return 'en';
        }

        return DEFAULT_LANG;
    }

    public getCurrentLang(): string {
        return this.lang;
    }
}
