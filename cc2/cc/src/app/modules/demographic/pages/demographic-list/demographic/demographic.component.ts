import { Component, Input } from '@angular/core';
import { MatchModel } from '@shared/models/match.model';
import { DataTableService } from '@shared/modules/data-table/data-table.service';
import { MATCH_INLINE_EDIT_ENDPOINT } from '@src/app/app.constant';
import { DemographicListService } from '@src/app/modules/demographic/pages/demographic-list/demographic-list.service';
import { getDemographicLabel } from '@shared/static-data/demographic.data';

@Component({
    selector: '[demographic]',
    templateUrl: './demographic.template.html'
})

export class DemographicComponent {

    @Input()
    demographic: MatchModel;

    @Input()
    isSelected: boolean;

    getDemographicLabel = getDemographicLabel;

    editType = '';

    MATCH_INLINE_EDIT_ENDPOINT = MATCH_INLINE_EDIT_ENDPOINT;

    constructor(public dataTableService: DataTableService, public demographicListService: DemographicListService) {
    }

    selectDemographic() {
        this.dataTableService.toggleSelectRow(this.demographic.id);
    }

    openInlineEdit(type: string) {
        if (this.editType === type) {
            this.editType = '';
            return;
        }
        this.editType = type;
    }

    closeInlineEdit() {
        this.editType = '';
    }
}
