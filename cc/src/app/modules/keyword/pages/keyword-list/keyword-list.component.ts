import { Component, ChangeDetectionStrategy } from '@angular/core';
import { KeywordListService } from './keyword-list.service';
import { DataTableService } from '@shared/modules/data-table/data-table.service';
import { fadeInAnimation } from '@shared/animation/fade-in.animation';
import { MATCH_MULTI_EDIT_STATUS_ENDPOINT } from '@src/app/app.constant';
import { KeywordListFilterService } from '@src/app/modules/keyword/pages/keyword-list/keyword-list-filter.service';

@Component({
    selector: 'keyword-list',
    templateUrl: './keyword-list.template.html',
    animations: [fadeInAnimation],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class KeywordListComponent {

    MATCH_MULTI_EDIT_STATUS_ENDPOINT = MATCH_MULTI_EDIT_STATUS_ENDPOINT;

    constructor(
        public service: KeywordListService,
        public dataTableService: DataTableService,
        public filterService: KeywordListFilterService
    ) {
    }
}

