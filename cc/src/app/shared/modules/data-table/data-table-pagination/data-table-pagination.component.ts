import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AutoUnsubscribe } from '@src/app/app.utils';
import { DataTableService } from '@shared/modules/data-table/data-table.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'data-table-pagination',
    templateUrl: './data-table-pagination.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

@AutoUnsubscribe()

export class DataTablePaginationComponent {

    total: number;
    currentPage: number;
    limit: number;

    totalSub: Subscription;
    currentPageSub: Subscription;
    limitSub: Subscription;

    @Input()
    isMainComponent: boolean;

    constructor(
        private ref: ChangeDetectorRef,
        private router: Router,
        private route: ActivatedRoute,
        public dataTableService: DataTableService
    ) {
        this.totalSub = this.dataTableService.getTotalItems().subscribe((value: number) => {
            if (this.total !== value) {
                this.total = value;
                this.ref.markForCheck();
            }
        });
        this.currentPageSub = this.dataTableService.getCurrentPage().subscribe((value) => {
            this.currentPage = value;
            this.ref.markForCheck();
        });
        this.limitSub = this.dataTableService.getPageLimit().subscribe(value => this.limit = value);
    }

    changePage(e) {
        if (e.page !== this.dataTableService.getCurrentPageValue()) {
            this.router.navigate(
                ['../'],
                {
                    relativeTo: this.route,
                    queryParams: { page: e.page },
                    queryParamsHandling: 'merge'
                });
        }
    }

    onChangeLimit(e) {
        // timeout for smoothly with css animation
        setTimeout(() => {
            this.dataTableService.setPageLimit(e.value);
            this.dataTableService.setCurrentPage(1);
            this.dataTableService.getRowsData();
        }, 150);
    }

    get numsPage(): number {
        return Math.ceil(this.total / this.limit);
    }

    get offset(): number {
        return (this.currentPage - 1) * this.limit;
    }
}
