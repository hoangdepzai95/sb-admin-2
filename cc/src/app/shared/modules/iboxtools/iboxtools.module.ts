import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap';

import { IboxtoolsComponent } from './iboxtools.component';

@NgModule({
    declarations: [IboxtoolsComponent],
    imports: [CommonModule, BsDropdownModule.forRoot()],
    exports: [IboxtoolsComponent],
})

export class IboxtoolsModule {
}
