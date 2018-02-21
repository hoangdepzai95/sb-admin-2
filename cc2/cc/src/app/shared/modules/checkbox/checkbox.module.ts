import { NgModule } from '@angular/core';
import { CheckboxComponent } from '@shared/modules/checkbox/checkbox.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        CheckboxComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        CheckboxComponent
    ]
})

export class CheckboxModule {
}
