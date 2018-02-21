import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DemographicListService } from '@src/app/modules/demographic/pages/demographic-list/demographic-list.service';
import { DataTableService } from '@shared/modules/data-table/data-table.service';
import { fadeInAnimation } from '@shared/animation/fade-in.animation';
import { MATCH_MULTI_EDIT_STATUS_ENDPOINT } from '@src/app/app.constant';
import { DemographicListFilterService } from './demographic-list-filter.service';

@Component({
    selector: 'demographic-list',
    templateUrl: './demographic-list.template.html',
    animations: [fadeInAnimation],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class DemographicListComponent {

    MATCH_MULTI_EDIT_STATUS_ENDPOINT = MATCH_MULTI_EDIT_STATUS_ENDPOINT;

    constructor(
        public service: DemographicListService,
        public dataTableService: DataTableService,
        public filterService: DemographicListFilterService
    ) {
    }
}

