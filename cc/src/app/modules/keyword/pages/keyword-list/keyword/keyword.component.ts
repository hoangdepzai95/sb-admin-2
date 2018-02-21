import { Component, Input } from '@angular/core';
import { MatchModel } from '@shared/models/match.model';
import { KeywordListService } from '@src/app/modules/keyword/pages/keyword-list/keyword-list.service';
import { DataTableService } from '@shared/modules/data-table/data-table.service';
import { MATCH_INLINE_EDIT_ENDPOINT } from '@src/app/app.constant';

@Component({
    selector: '[keyword]',
    templateUrl: './keyword.template.html'
})

export class KeywordComponent {

    @Input()
    keyword: MatchModel;

    @Input()
    isSelected: boolean;

    editType = '';

    MATCH_INLINE_EDIT_ENDPOINT = MATCH_INLINE_EDIT_ENDPOINT;

    constructor(public dataTableService: DataTableService, public keywordListService: KeywordListService) {
    }

    selectKeyword() {
        this.dataTableService.toggleSelectRow(this.keyword.id);
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
