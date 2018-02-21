import { NgModule } from '@angular/core';
import { AddAloBtnComponent } from './add-alo-btn.component';
import { SharedModule } from '@shared/modules/shared.module';
import { AddAloBtnService } from '@shared/modules/add-alo-btn/add-alo-btn.service';
import { LocationWidgetComponent } from '@shared/modules/add-alo-btn/location-widget/location-widget.component';
import { SliderModule } from '@shared/modules/slider/slider.module';
import { CircleLoadingModule } from '@shared/modules/circle-loading/circle-loading.module';

@NgModule({
    declarations: [
        AddAloBtnComponent,
        LocationWidgetComponent
    ],
    imports: [
        SharedModule,
        SliderModule,
        CircleLoadingModule
    ],
    providers: [
      AddAloBtnService
    ],
    exports: [
        AddAloBtnComponent
    ]
})

export class AddAloBtnModule {
}
