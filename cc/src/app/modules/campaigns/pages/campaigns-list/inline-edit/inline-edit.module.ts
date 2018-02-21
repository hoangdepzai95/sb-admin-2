import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/modules/shared.module';

import { InlineBudgetEditComponent } from './inline-budget-edit/inline-budget-edit.component';
import { InlineDurationEditComponent } from './inline-duration-edit/inline-duration-edit.component';

import { InlineBudgetEditService } from './inline-budget-edit/inline-budget-edit.service';
import { InlineDurationEditService } from './inline-duration-edit/inline-duration-edit.service';
import { DataTableEditorModule } from '@shared/modules/data-table-editor/data-table-editor.module';
import { DateRangeModule } from '@shared/modules/date-range/date-range.module';

@NgModule({
    declarations: [
        InlineBudgetEditComponent,
        InlineDurationEditComponent,
    ],
    imports: [
        FormsModule,
        SharedModule,
        DataTableEditorModule,
        DateRangeModule
    ],
    providers: [
        InlineBudgetEditService,
        InlineDurationEditService
    ],
    exports: [
        InlineBudgetEditComponent,
        InlineDurationEditComponent
    ]
})

export class InlineEditModule {
}
