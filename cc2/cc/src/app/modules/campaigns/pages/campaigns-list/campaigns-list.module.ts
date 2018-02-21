import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CampaignsListComponent } from './campaigns-list.component';

import { FormsModule } from '@angular/forms';
import { InlineEditModule } from '@src/app/modules/campaigns/pages/campaigns-list/inline-edit/inline-edit.module';
import { SharedModule } from '@shared/modules/shared.module';

import { CampaignsListService } from './campaigns-list.service';
import { DateRangeComponent } from '@src/app/modules/campaigns/pages/campaigns-list/date-range/date-range.component';
import { CampaignComponent } from '@src/app/modules/campaigns/pages/campaigns-list/campaign/campaign.component';
import { DataTableModule } from '@shared/modules/data-table/data-table.module';
import { SingleFilterModule } from '@shared/modules/single-filter/single-filter.module';


@NgModule({
    declarations: [
        CampaignsListComponent,
        DateRangeComponent,
        CampaignComponent,
    ],
    imports: [
        SharedModule,
        FormsModule,
        DataTableModule,
        SingleFilterModule,
        RouterModule.forChild([
            { path: '', component: CampaignsListComponent }
        ]),
        InlineEditModule,
    ],
    providers: [
        CampaignsListService,
    ]
})

export class CampaignsListModule {
}
