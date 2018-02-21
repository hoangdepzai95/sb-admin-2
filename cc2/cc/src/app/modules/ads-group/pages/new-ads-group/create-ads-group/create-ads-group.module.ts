import { NgModule } from '@angular/core';
import { CreateAdsGroupComponent } from './create-ads-group.component';
import { SharedModule } from '@shared/modules/shared.module';
import { CreateAdsGroupService } from './create-ads-group.service';
import { AutoCompleteModule } from '@shared/modules/auto-complete/auto-complete.module';
import { GeoTargetingComponent } from './geo-targeting/geo-targeting.component';
import { GoogleMapService } from '@shared/services/google-map.service';
import { SchedulingModule } from '@shared/modules/scheduling/scheduling.module';

@NgModule({
    declarations: [
        CreateAdsGroupComponent,
        GeoTargetingComponent
    ],
    imports: [
        SharedModule,
        AutoCompleteModule,
        SchedulingModule
    ],
    providers: [
        CreateAdsGroupService,
        GoogleMapService
    ],
    exports: [
        CreateAdsGroupComponent
    ]
})

export class CreateAdsGroupModule {
}
