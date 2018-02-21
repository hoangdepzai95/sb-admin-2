import {
    Component,
    Input,
    OnInit,
    HostListener,
    AfterViewInit,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    ElementRef
} from '@angular/core';
import { ASC } from '@src/app/app.constant';
import { DataTableService } from '@shared/modules/data-table/data-table.service';
import { Subscription } from 'rxjs/Subscription';
import { AutoUnsubscribe } from '@src/app/app.utils';
import { SortStateModel } from '@shared/models/sort-state.model';
import { DataTableColumnModel, DataTableFieldsModels } from '@shared/models/data-table-fields.model';
import { DataTableColumnsWidthModel } from '@shared/models/data-table-columns-width.model';
import { ActivatedRoute, Router } from '@angular/router';

declare const $: any;

@Component({
    selector: '[app-data-table-head]',



    templateUrl: './data-table-head.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe()

export class DataTableHeadComponent implements OnInit, AfterViewInit {

    @Input()
    tableFields: DataTableFieldsModels;

    isSelectedAllRows: boolean;
    isSelectedAllRowsSub: Subscription;

    loading: boolean;
    loadingSub: Subscription;

    sortState: SortStateModel;
    sortStateSub: Subscription;
    syncSizeSub: Subscription;

    $table: any;
    $tableHead: any;
    $pageHeader: any;
    pageHeaderHeight: string;
    showFixedHead = false;
    tableWidth: string;
    tableColumnsWidth = [];
    tableColumnsWidthSub: Subscription;
    tableOffsetLeft: string;

    constructor(
        public service: DataTableService,
        private router: Router,
        private route: ActivatedRoute,
        private cdRef: ChangeDetectorRef,
        private elRef: ElementRef
    ) {
        this.sortStateSub = this.service.getSortState().subscribe((value: SortStateModel) => {
            this.sortState = value;
        });

        this.isSelectedAllRowsSub = this.service.getIsSelectedAllRows().subscribe((value: boolean) => {
            this.isSelectedAllRows = value;
        });

        this.loadingSub = this.service.getLoading().subscribe((loading: boolean) => {
            this.loading = loading;
            this.cdRef.markForCheck();
        });

        this.tableColumnsWidthSub = this.service.getTableColumnsWidth().subscribe((value: DataTableColumnsWidthModel) => {
            this.tableColumnsWidth = value;
            this.cdRef.markForCheck();
        });
    }

    ngOnInit() {
        this.syncSizeSub = this.service.getObservableDataTable().subscribe(() => {
            this.syncTableSize();
        });
    }

    toggleSelectAllRows() {
        this.service.toggleSelectAllRows(this.isSelectedAllRows);
    }

    getSortIconClass(sortKey: string) {
        if (sortKey !== this.sortState.sortKey) {
            return '';
        } else if (this.sortState.sortOrder === ASC) {
            return 'sort-asc';
        } else {
            return 'sort-desc';
        }
    }

    onSortTable(sortKey: string) {
        this.service.setSortState(sortKey);
        this.router.navigate(
            ['./'],
            {
                relativeTo: this.route,
                queryParams: { page: 1 },
                queryParamsHandling: 'merge'
            });
        if (this.service.getCurrentPageValue() === 1) {
            this.service.getRowsData();
        }
    }

    ngAfterViewInit() {
        this.$table = $(this.elRef.nativeElement).parent();
        this.$tableHead = this.$table.find('> thead');
        this.$pageHeader = $('#page_header');
    }

    syncPageHeaderHeight() {
        this.pageHeaderHeight = `${this.$pageHeader.outerHeight()}px`;
    }

    syncColumnsWidth() {
        const tableColumnsWidth = [...this.tableColumnsWidth];
        let widthChanged = false;

        this.$tableHead.find('th').each(function (index) {
            const newWidth = `${$(this).outerWidth()}px`;
            if (tableColumnsWidth[index] !== newWidth) {
                tableColumnsWidth[index] = newWidth;
                widthChanged = true;
            }
        });

        if (widthChanged) {
            this.service.setTableColmnsWidth(tableColumnsWidth);
        }
    }
    syncTableWidth() {
        const tableWidth = `${this.$table.outerWidth()}px`;
        if (this.tableWidth !== tableWidth) {
            this.tableWidth = tableWidth;
        }
    }

    syncTableOffsetLeft() {
        this.tableOffsetLeft = `${this.$table.offset().left}px`;
    }

    @HostListener('window:click')
    onDocumentClick() {
        // timeout must equal with css transition time
        setTimeout(() => {
            this.syncTableSize();
        }, 400);
    }

    @HostListener('window:resize')
    syncTableSize() {
        if (this.$table) {
            setTimeout(() => {
                this.syncPageHeaderHeight();
                this.syncTableWidth();
                this.syncColumnsWidth();
                this.syncTableOffsetLeft();
            });
        }
    }

    @HostListener('window:scroll')
    onScroll() {
        const windowOffset = $(window).scrollTop();
        const tableOffsetTop = this.$table.offset().top;
        const pageHeaderHeight = this.$pageHeader.outerHeight();
        const tableOffsetBottom = tableOffsetTop + this.$table.height() - this.$tableHead.height();
        if (windowOffset < tableOffsetTop - pageHeaderHeight || windowOffset > tableOffsetBottom - pageHeaderHeight) {
            this.showFixedHead = false;
        } else if (
            windowOffset >= tableOffsetTop - pageHeaderHeight &&
            windowOffset <= tableOffsetBottom - pageHeaderHeight &&
            !this.showFixedHead
        ) {
            this.syncTableSize();
            this.showFixedHead = true;
        }
    }

    trackBySortKey(field: DataTableColumnModel) {
        return field.sortKey;
    }

    getTableFields(): DataTableFieldsModels {
        let tableFields = [...this.tableFields];
        if (this.service.getInCampaignContextValue()) {
            tableFields =  tableFields.filter(field => !field.hideInCampaignContext);
        }

        if (this.service.getInAdsGroupContextValue()) {
            tableFields = tableFields.filter(field => !field.hideInAdsGroupContext);
        }

        return tableFields;
    }
}
