import { NgModule } from '@angular/core';
import { NewAdsGroupComponent } from './new-ads-group.component';
import { SharedModule } from '@shared/modules/shared.module';
import { RouterModule } from '@angular/router';
import { CreateAdsGroupModule } from './create-ads-group/create-ads-group.module';

@NgModule({
    declarations: [
        NewAdsGroupComponent
    ],
    imports: [
        SharedModule,
        CreateAdsGroupModule,
        RouterModule.forChild([
            { path: '', component: NewAdsGroupComponent }
        ])
    ],
    exports: [
        NewAdsGroupComponent
    ]
})

export class NewAdsGroupModule {
}
