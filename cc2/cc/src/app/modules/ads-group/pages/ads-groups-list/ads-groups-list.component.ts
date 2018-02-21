import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AdsGroupService } from './ads-group.service';
import { fadeInAnimation } from '@shared/animation/fade-in.animation';
import { DataTableService } from '@shared/modules/data-table/data-table.service';
import { AdsGroupsFilterService } from '@src/app/modules/ads-group/pages/ads-groups-list/ads-groups-filter.service';
import { MULTI_EDIT_ADS_GROUP_STATUS_ENDPOINT } from '@src/app/app.constant';

@Component({
    selector: 'app-ads-groups-list',
    templateUrl: './ads-groups-list.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInAnimation]
})

export class AdsGroupsListComponent {

    MULTI_EDIT_ADS_GROUP_STATUS_ENDPOINT = MULTI_EDIT_ADS_GROUP_STATUS_ENDPOINT;

    constructor(
        public dataTableService: DataTableService,
        public service: AdsGroupService,
        public filterService: AdsGroupsFilterService,
    ) {
    }

}
