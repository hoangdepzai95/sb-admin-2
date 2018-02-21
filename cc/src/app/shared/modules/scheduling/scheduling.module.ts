import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/modules/shared.module';
import { SchedulingComponent } from '@shared/modules/scheduling/scheduling.component';
import { DateRangeModule } from '@shared/modules/date-range/date-range.module';

@NgModule({
    declarations: [
        SchedulingComponent
    ],
    imports: [
        SharedModule,
        DateRangeModule
    ],
    exports: [
        SchedulingComponent
    ]
})

export class SchedulingModule {
}
