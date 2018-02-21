import { Component, Input, OnInit } from '@angular/core';
import { DataTableFieldsModels } from '@shared/models/data-table-fields.model';
import { DataTableService } from './data-table.service';
import { ActivatedRoute } from '@angular/router';
import { SelectedRowsTextsModel } from '@shared/models/selected-rows-texts.model';

@Component({
    selector: 'data-table',
    templateUrl: './data-table.template.html'
})

export class DataTableComponent implements OnInit {

    @Input()
    name: string;

    @Input()
    defaultSortKey: string;

    @Input()
    tableFields: DataTableFieldsModels;

    @Input()
    notFoundText: string;

    @Input()
    selectedRowsTexts: SelectedRowsTextsModel;

    @Input()
    tableClass: string;

    @Input()
    getRowsDataFunc: Function;

    constructor(
        public service: DataTableService,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.service.init(
            this.name,
            this.defaultSortKey,
            this.getRowsDataFunc,
            this.selectedRowsTexts,
            this.route
        );

        this.route.queryParams.subscribe((params) => {
            const routerPage = +params['page'];
            if (routerPage) {
                this.service.setCurrentPage(routerPage);
            }
            this.service.getRowsData();
        });

        window.scrollTo(0, 0);
    }
}
