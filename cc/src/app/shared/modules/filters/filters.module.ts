import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { AppFiltersComponent } from '@shared/modules/filters/filters.component';
import { DropdownModule } from '@shared/modules/dropdown/dropdown.module';
import { MyDatePickerModule } from 'mydatepicker';
import { AppFilterService } from '@shared/modules/filters/filter.service';

@NgModule({
    declarations: [
        AppFiltersComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
        DropdownModule,
        FormsModule,
        MyDatePickerModule
    ],
    providers: [
        AppFilterService
    ],
    exports: [
        AppFiltersComponent
    ]
})

export class AppFiltersModule {
}
