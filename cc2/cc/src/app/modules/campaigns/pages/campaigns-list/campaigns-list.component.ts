import {
    Component,
    ChangeDetectionStrategy,
} from '@angular/core';

import { CampaignsListService } from './campaigns-list.service';
import { fadeInAnimation } from '@shared/animation/fade-in.animation';
import { DataTableService } from '@shared/modules/data-table/data-table.service';
import { CampaignsListFilterService } from './campaigns-list-filter.service';
import { MULTI_EDIT_CAMPAIGN_STATUS_ENDPOINT } from '@src/app/app.constant';

@Component({
    selector: 'app-campaigns-list',
    templateUrl: 'campaigns-list.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInAnimation],
})

export class CampaignsListComponent {

    MULTI_EDIT_CAMPAIGN_STATUS_ENDPOINT = MULTI_EDIT_CAMPAIGN_STATUS_ENDPOINT;

    constructor(
        public dataTableService: DataTableService,
        public service: CampaignsListService,
        public filterService: CampaignsListFilterService
    ) {
    }

}

