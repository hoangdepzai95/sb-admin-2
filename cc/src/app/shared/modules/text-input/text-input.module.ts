import { NgModule } from '@angular/core';
import { TextInputComponent } from '@shared/modules/text-input/text-input.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        TextInputComponent
    ],
    imports: [
        CommonModule,
        TranslateModule
    ],
    exports: [
        TextInputComponent
    ]
})

export class TextInputModule {
}
