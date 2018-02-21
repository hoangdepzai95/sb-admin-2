import { NgModule } from '@angular/core';
import { SingleFilterComponent } from './single-filter.component';
import { SharedModule } from '@shared/modules/shared.module';

@NgModule({
    declarations: [
        SingleFilterComponent
    ],
    imports: [
        SharedModule
    ],
    exports: [
        SingleFilterComponent
    ]
})

export class SingleFilterModule {
}
