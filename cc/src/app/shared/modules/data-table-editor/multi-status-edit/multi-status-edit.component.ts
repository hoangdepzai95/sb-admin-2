import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

import { AutoUnsubscribe } from '@src/app/app.utils';
import { DataTableService } from '@shared/modules/data-table/data-table.service';
import { DropDownItemModel } from '@shared/models/dropdown-options.model';
import { DataTableSelectedRowsModel } from '@shared/models/data-table-selected-rows.model';
import { MultiStatusEditService } from './multi-status-edit.service';
import { USER_STATUS_OPTIONS } from '@shared/static-data/user-status.data';

declare const toastr: any;

@Component({
    selector: 'data-table-multi-status-edit',
    templateUrl: './multi-status-edit.template.html'
})

@AutoUnsubscribe()

export class  MultiStatusEditComponent {

    @Input()
    endPoint: string;

    selectedRows: DataTableSelectedRowsModel;
    isEditing = false;

    selectedRowsSub: Subscription;

    USER_STATUS_OPTIONS = USER_STATUS_OPTIONS;

    constructor(
        private translate: TranslateService,
        private dataTableService: DataTableService,
        public service: MultiStatusEditService,
    ) {
        this.selectedRowsSub = this.dataTableService.getSelectedRows().subscribe(value => this.selectedRows = value);
    }

    onOpen() {
        if (!this.selectedRows.length) {
            toastr.info(this.translate.instant('common.No rows selected. Please use the checkboxes to select the rows to edit.' +
                '\nYou can also select all rows on this page or all rows across all pages'), { timeOut: 5000 });
        }
    }

    async multiEditStatus(e: DropDownItemModel) {

        const filter = JSON.parse(this.dataTableService.getRequestParams().get('filter'));

        this.isEditing = true;
        await this.service.multiEditStatus(
            this.endPoint,
            this.selectedRows,
            +e.value,
            this.dataTableService.getIsSelectedTotalItemValue(),
            filter
        );
        this.isEditing = false;
        this.dataTableService.getRowsData();
    }
}
