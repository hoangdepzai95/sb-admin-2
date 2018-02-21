import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BreadcrumbModel } from '@shared/models/breadcrumb.model';

import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class BreadcrumbService {

    private breadcrumbs = new BehaviorSubject<BreadcrumbModel[]>([{
        path: 'common.All campaigns',
        translate: true,
        fullPath: '/campaigns/list',
        id: 'all_campaigns'
    }]);

    getBreadcrumbs(): Observable<BreadcrumbModel[]> {
        return this.breadcrumbs.asObservable();
    }

    pushBreadcrumbs(item: BreadcrumbModel) {
        let currentItems = this.breadcrumbs.getValue();
        currentItems = currentItems.filter(o => o.id !== item.id);
        this.breadcrumbs.next([...currentItems, item]);
    }

    removeBreadcrumbs(ids: Array<string>) {
        let currentItems = this.breadcrumbs.getValue();
        currentItems = currentItems.filter(o => !ids.includes(o.id));
        this.breadcrumbs.next(currentItems);
    }


}
