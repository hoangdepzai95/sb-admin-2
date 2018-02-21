import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/modules/shared.module';
import { RouterModule } from '@angular/router';
import { KeywordListComponent } from './keyword-list.component';
import { KeywordListService } from '@src/app/modules/keyword/pages/keyword-list/keyword-list.service';
import { KeywordComponent } from '@src/app/modules/keyword/pages/keyword-list/keyword/keyword.component';
import { DataTableModule } from '@shared/modules/data-table/data-table.module';
import { SingleFilterModule } from '@shared/modules/single-filter/single-filter.module';
import { KeywordListFilterService } from '@src/app/modules/keyword/pages/keyword-list/keyword-list-filter.service';

@NgModule({
    declarations: [
        KeywordListComponent,
        KeywordComponent
    ],
    imports: [
        SharedModule,
        DataTableModule,
        SingleFilterModule,
        RouterModule.forChild([
            { path: '', component: KeywordListComponent }
        ])
    ],
    providers: [
        KeywordListFilterService,
        KeywordListService
    ],
    exports: [
        KeywordListComponent
    ]
})

export class KeywordListModule {
}
