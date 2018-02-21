import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { BreadcrumbService } from './breadcrumb.service';
import { AutoUnsubscribe } from '@src/app/app.utils';
import { BreadcrumbModel } from '@shared/models/breadcrumb.model';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe()

export class BreadcrumbComponent {

    breadcrumbsSub: Subscription;
    breadcrumbs: BreadcrumbModel[];

    constructor(
        private service: BreadcrumbService,
        private ref: ChangeDetectorRef,
    ) {
            this.breadcrumbsSub = this.service.getBreadcrumbs().subscribe((value) => {
                this.breadcrumbs = value;
                this.ref.markForCheck();
            });

       }
}
