import { NgModule } from '@angular/core';
import { CircleLoadingComponent } from '@shared/modules/circle-loading/circle-loading.component';

@NgModule({
    declarations: [
        CircleLoadingComponent
    ],
    exports: [
        CircleLoadingComponent
    ]
})

export class CircleLoadingModule {
}
