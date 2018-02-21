import { NgModule } from '@angular/core';
import { NewCampaignComponent } from './new-campaign.component';
import { SharedModule } from '@shared/modules/shared.module';
import { RouterModule } from '@angular/router';
import { NewCampaignService } from './new-campaign.service';
import { DateRangeModule } from '@shared/modules/date-range/date-range.module';
import { UiSwitchModule } from 'ngx-ui-switch';
import { AddAloBtnModule } from '@shared/modules/add-alo-btn/add-alo-btn.module';
import { CircleLoadingModule } from '@shared/modules/circle-loading/circle-loading.module';

@NgModule({
    declarations: [
        NewCampaignComponent,
    ],
    imports: [
        SharedModule,
        DateRangeModule,
        AddAloBtnModule,
        UiSwitchModule,
        CircleLoadingModule,
        RouterModule.forChild([
            { path: '', component: NewCampaignComponent }
        ])
    ],
    providers: [
        NewCampaignService
    ]
})

export class NewCampaignModule {
}
