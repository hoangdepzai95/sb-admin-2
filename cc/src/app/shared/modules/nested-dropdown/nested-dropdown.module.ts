import { NgModule } from '@angular/core';
import { NestedDropdownComponent } from './nested-dropdown.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        NestedDropdownComponent
    ],
    imports: [
        TranslateModule,
        CommonModule
    ],
    exports: [
        NestedDropdownComponent
    ]
})

export class NestedDropdownModule {
}
