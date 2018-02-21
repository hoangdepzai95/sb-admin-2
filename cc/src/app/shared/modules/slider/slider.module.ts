import { NgModule } from '@angular/core';
import { SliderComponent } from '@shared/modules/slider/slider.component';
import { SharedModule } from '@shared/modules/shared.module';

@NgModule({
    declarations: [
        SliderComponent
    ],
    imports: [
        SharedModule
    ],
    exports: [
        SliderComponent
    ]
})

export class SliderModule {
}
