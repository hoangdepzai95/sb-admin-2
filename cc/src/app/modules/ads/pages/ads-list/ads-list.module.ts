import { NgModule } from '@angular/core';
import { AdsListComponent } from './ads-list.component';
import { SharedModule } from '@shared/modules/shared.module';
import { RouterModule } from '@angular/router';
import { SingleFilterModule } from '@shared/modules/single-filter/single-filter.module';
import { DataTableModule } from '@shared/modules/data-table/data-table.module';
import { AdvertComponent } from '@src/app/modules/ads/pages/ads-list/advert/advert.component';
import { AdsListService } from '@src/app/modules/ads/pages/ads-list/ads-list.service';
import { AdsListFilterService } from '@src/app/modules/ads/pages/ads-list/ads-list-filter.service';

@NgModule({
    declarations: [
        AdsListComponent,
        AdvertComponent
    ],
    imports: [
        SharedModule,
        DataTableModule,
        SingleFilterModule,
        RouterModule.forChild([
            { path: '', component: AdsListComponent }
        ])
    ],
    providers: [
        AdsListFilterService,
        AdsListService
    ],
    exports: [
        AdsListComponent
    ]
})

export class AdsListModule {
}
