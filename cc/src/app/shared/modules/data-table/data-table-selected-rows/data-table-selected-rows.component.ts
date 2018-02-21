import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { AutoUnsubscribe } from '@src/app/app.utils';
import { Subscription } from 'rxjs/Subscription';
import { fadeInAnimation } from '@shared/animation/fade-in.animation';
import { DataTableService } from '@shared/modules/data-table/data-table.service';
import { DataTableSelectedRowsModel } from '@shared/models/data-table-selected-rows.model';
import { SelectedRowsTextsModel } from '@shared/models/selected-rows-texts.model';

@Component({
    selector: 'data-table-selected-rows',
    templateUrl: './data-table-selected-rows.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInAnimation]
})

@AutoUnsubscribe()

export class DataTableSelectedRowsComponent {

    @Input()
    totalItems: number;

    isSelectedAllRows: boolean;
    isSelectedTotalItems: boolean;
    selectedRows: Array<number>;
    selectedRowsTexts: SelectedRowsTextsModel;

    selectedRowsSub: Subscription;
    isSelectedTotalItemsSub: Subscription;
    isSelectedAllRowsSub: Subscription;
    selectedRowsTextsSub: Subscription;

    constructor(
        private cdRef: ChangeDetectorRef,
        private dataTableService: DataTableService
    ) {

        this.selectedRowsSub = this.dataTableService.getSelectedRows().subscribe((value: DataTableSelectedRowsModel) => {
            this.selectedRows = value;
            this.cdRef.markForCheck();
        });

        this.isSelectedAllRowsSub = this.dataTableService.getIsSelectedAllRows().subscribe((value: boolean) => {
            this.isSelectedAllRows = value;
        });

        this.isSelectedTotalItemsSub = this.dataTableService.getIsSelectedTotalItems().subscribe((value) => {
            this.isSelectedTotalItems = value;
            this.cdRef.markForCheck();
        });

        this.selectedRowsTextsSub = this.dataTableService.getSelectedRowsTexts().subscribe((value: SelectedRowsTextsModel) => {
            this.selectedRowsTexts = value;
        });
    }

    selectTotalItems() {
        this.dataTableService.selectTotalItems();
    }

    deselectTotalItems() {
        this.dataTableService.unSelectAllRows();
        this.dataTableService.deselectTotalItems();
    }
}
