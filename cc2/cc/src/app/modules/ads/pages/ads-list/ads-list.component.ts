import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AdsListService } from '@src/app/modules/ads/pages/ads-list/ads-list.service';
import { DataTableService } from '@shared/modules/data-table/data-table.service';
import { fadeInAnimation } from '@shared/animation/fade-in.animation';
import { AdsListFilterService } from '@src/app/modules/ads/pages/ads-list/ads-list-filter.service';
import { MULTI_EDIT_ADVERT_STATUS_ENDPOINT } from '@src/app/app.constant';

@Component({
    selector: 'ads-list',
    templateUrl: './ads-list.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInAnimation]
})

export class AdsListComponent {

    MULTI_EDIT_ADVERT_STATUS_ENDPOINT = MULTI_EDIT_ADVERT_STATUS_ENDPOINT;

    constructor(
        public service: AdsListService,
        public dataTableService: DataTableService,
        public filterService: AdsListFilterService
    ) {
    }
}
