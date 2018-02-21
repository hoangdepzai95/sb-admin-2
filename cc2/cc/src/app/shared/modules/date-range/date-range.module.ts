import { NgModule } from '@angular/core';
import { DateRangeComponent } from './date-range.component';
import { SharedModule } from '@shared/modules/shared.module';
import { MyDatePickerModule } from 'mydatepicker';

@NgModule({
    declarations: [
        DateRangeComponent
    ],
    imports: [
        SharedModule,
        MyDatePickerModule
    ],
    exports: [
        DateRangeComponent
    ]
})

export class DateRangeModule {
}
