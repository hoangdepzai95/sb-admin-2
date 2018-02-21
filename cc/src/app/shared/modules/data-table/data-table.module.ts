import { NgModule } from '@angular/core';
import { DataTableComponent } from './data-table.component';
import { DataTablePaginationComponent } from './data-table-pagination/data-table-pagination.component';
import { DataTableHeadComponent } from './data-table-head/data-table-head.component';
import { DataTableSelectedRowsComponent } from './data-table-selected-rows/data-table-selected-rows.component';
import { DataTableService } from './data-table.service';
import { SharedModule } from '@shared/modules/shared.module';
import { PaginationModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { DataTableEditorModule } from '@shared/modules/data-table-editor/data-table-editor.module';
import { DataTableTopBlockModule } from '@shared/modules/data-table-top-block/data-table-top-block.module';

@NgModule({
    declarations: [
        DataTableComponent,
        DataTablePaginationComponent,
        DataTableHeadComponent,
        DataTableSelectedRowsComponent
    ],
    imports: [
        SharedModule,
        DataTableTopBlockModule,
        DataTableEditorModule,
        PaginationModule.forRoot(),
        FormsModule
    ],
    exports: [
        DataTableComponent,
        DataTableTopBlockModule,
        DataTableEditorModule
    ],
    providers: [
        DataTableService
    ]
})

export class DataTableModule {
}
