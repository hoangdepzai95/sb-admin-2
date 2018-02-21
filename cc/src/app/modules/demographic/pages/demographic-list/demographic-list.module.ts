import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/modules/shared.module';
import { RouterModule } from '@angular/router';
import { DemographicListComponent } from '@src/app/modules/demographic/pages/demographic-list/demographic-list.component';
import { DataTableModule } from '@shared/modules/data-table/data-table.module';
import { SingleFilterModule } from '@shared/modules/single-filter/single-filter.module';
import { DemographicComponent } from '@src/app/modules/demographic/pages/demographic-list/demographic/demographic.component';
import { DemographicListService } from '@src/app/modules/demographic/pages/demographic-list/demographic-list.service';
import { DemographicListFilterService } from '@src/app/modules/demographic/pages/demographic-list/demographic-list-filter.service';

@NgModule({
    declarations: [
        DemographicListComponent,
        DemographicComponent
    ],
    imports: [
        SharedModule,
        DataTableModule,
        SingleFilterModule,
        RouterModule.forChild([
            { path: '', component: DemographicListComponent }
        ])
    ],
    providers: [
        DemographicListService,
        DemographicListFilterService
    ],
    exports: [
        DemographicListComponent
    ]
})

export class DemographicListModule {
}
