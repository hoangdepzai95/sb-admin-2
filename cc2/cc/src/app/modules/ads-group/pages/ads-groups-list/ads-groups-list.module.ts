import { NgModule } from '@angular/core';
import { AdsGroupsListComponent } from './ads-groups-list.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/modules/shared.module';
import { AdsGroupService } from './ads-group.service';
import { AdsGroupComponent } from '@src/app/modules/ads-group/pages/ads-groups-list/ads-group/ads-group.component';
import { DataTableModule } from '@shared/modules/data-table/data-table.module';
import { SingleFilterModule } from '@shared/modules/single-filter/single-filter.module';
import { AdsGroupsFilterService } from '@src/app/modules/ads-group/pages/ads-groups-list/ads-groups-filter.service';

@NgModule({
    declarations: [
        AdsGroupsListComponent,
        AdsGroupComponent,
    ],
    imports: [
        SharedModule,
        DataTableModule,
        SingleFilterModule,
        RouterModule.forChild([
            { path: '', component: AdsGroupsListComponent }
        ])
    ],
    providers: [
        AdsGroupService,
        AdsGroupsFilterService,
    ],
    exports: [
        AdsGroupsListComponent
    ]
})

export class  AdsGroupsListModule {
}
