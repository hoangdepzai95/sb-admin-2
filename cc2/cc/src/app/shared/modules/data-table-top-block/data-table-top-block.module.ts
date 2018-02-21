import { NgModule } from '@angular/core';
import { DataTableTopBlockComponent } from './data-table-top-block.component';
import { SharedModule } from '@shared/modules/shared.module';
import { AppFiltersModule } from '@shared/modules/filters/filters.module';

@NgModule({
    declarations: [
        DataTableTopBlockComponent
    ],
    imports: [
        SharedModule,
        AppFiltersModule
    ],
    exports: [
        DataTableTopBlockComponent
    ]
})

export class DataTableTopBlockModule {
}

