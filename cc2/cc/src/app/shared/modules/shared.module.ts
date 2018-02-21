import { NgModule } from '@angular/core';
import { CheckboxModule } from '@shared/modules/checkbox/checkbox.module';
import { DropdownModule } from '@shared/modules/dropdown/dropdown.module';
import { NestedDropdownModule } from '@shared/modules/nested-dropdown/nested-dropdown.module';
import { LoadingModule } from '@shared/modules/loading/loading.module';
import { LayoutsModule } from '@src/app/modules/layout/layouts.module';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { DateFormatPipe } from '@shared/pipes/utils.pipe';
import { NumberFormatPipe } from '@shared/pipes/utils.pipe';
import { PercentFormatPipe } from '@shared/pipes/utils.pipe';
import { TooltipModule } from 'ngx-bootstrap';
import { TextInputModule } from '@shared/modules/text-input/text-input.module';
import { NumberInputModule } from '@shared/modules/number-input/number-input.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        DateFormatPipe,
        NumberFormatPipe,
        PercentFormatPipe
    ],
    imports: [
        CheckboxModule,
        DropdownModule,
        NestedDropdownModule,
        LoadingModule,
        LayoutsModule,
        TranslateModule,
        CommonModule,
        TooltipModule.forRoot(),
        TextInputModule,
        NumberInputModule,
        FormsModule
    ],
    exports: [
        DateFormatPipe,
        NumberFormatPipe,
        PercentFormatPipe,
        CheckboxModule,
        DropdownModule,
        LayoutsModule,
        NestedDropdownModule,
        LoadingModule,
        TranslateModule,
        CommonModule,
        TooltipModule,
        TextInputModule,
        NumberInputModule,
        FormsModule
    ]
})

export class SharedModule {
}
