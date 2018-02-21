import { Component } from '@angular/core';

import { smoothlyMenu } from '../../../app.helpers';
import { TranslateService } from '@ngx-translate/core';
import { LangService } from '../../../lang/lang.service';

declare const jQuery: any;

@Component({
    selector: 'app-topnavbar',
    templateUrl: 'topnavbar.template.html',
})
export class TopNavbarComponent {

    constructor(public translate: TranslateService, private langService: LangService) {
    }

    toggleNavigation(): void {
        jQuery('body').toggleClass('mini-navbar');
        smoothlyMenu();
    }

    changeLang(): void {
        this.langService.changeLang();
    }
}
