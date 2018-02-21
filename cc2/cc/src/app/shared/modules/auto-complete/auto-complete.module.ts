import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteComponent } from './auto-complete.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CircleLoadingModule } from '@shared/modules/circle-loading/circle-loading.module';

@NgModule({
    declarations: [
        AutoCompleteComponent
    ],
    imports: [
        CommonModule,
        CircleLoadingModule,
        TranslateModule,
        FormsModule
    ],
    exports: [
        AutoCompleteComponent
    ]
})

export class AutoCompleteModule {
}

