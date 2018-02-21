import { NgModule } from '@angular/core';
import { DropdownComponent } from './dropdown.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        DropdownComponent
    ],
    imports: [
        CommonModule,
        TranslateModule
    ],
    exports: [
        DropdownComponent
    ]
})

export class DropdownModule {
}
