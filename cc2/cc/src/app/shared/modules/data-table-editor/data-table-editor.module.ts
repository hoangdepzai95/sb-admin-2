import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/modules/shared.module';
import { MultiStatusEditComponent } from '@shared/modules/data-table-editor/multi-status-edit/multi-status-edit.component';
import { NameValidatorDirective } from '@shared/modules/data-table-editor/inline-name-edit/inline-name-edit.directive';
import { InlineNameEditComponent } from '@shared/modules/data-table-editor/inline-name-edit/inline-name-edit.component';
import { FormsModule } from '@angular/forms';
import { MultiStatusEditService } from '@shared/modules/data-table-editor/multi-status-edit/multi-status-edit.service';
import { InlineStatusEditService } from '@shared/modules/data-table-editor/inline-status-edit/inline-status-edit.service';
import { InlineStatusEditComponent } from '@shared/modules/data-table-editor/inline-status-edit/inline-status-edit.component';
import { InlineNameEditService } from '@shared/modules/data-table-editor/inline-name-edit/inline-name-edit.service';

@NgModule({
    declarations: [
        MultiStatusEditComponent,
        NameValidatorDirective,
        InlineNameEditComponent,
        InlineStatusEditComponent
    ],
    imports: [
        SharedModule,
        FormsModule
    ],
    providers: [
        MultiStatusEditService,
        InlineStatusEditService,
        InlineNameEditService
    ],
    exports: [
        MultiStatusEditComponent,
        InlineNameEditComponent,
        InlineStatusEditComponent
    ]
})

export class DataTableEditorModule {
}
