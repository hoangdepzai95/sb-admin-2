import { NgModule } from '@angular/core';
import { NumberInputComponent } from '@shared/modules/number-input/number-input.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        NumberInputComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule
    ],
    exports: [
        NumberInputComponent
    ]
})

export class NumberInputModule {
}
