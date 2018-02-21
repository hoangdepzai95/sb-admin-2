import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from './notification.service';
import { NotificationComponent } from './notification.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        NotificationComponent
    ],
    imports: [
        CommonModule,
        TranslateModule
    ],
    providers: [
        NotificationService,
    ],
    exports: [
        NotificationComponent
    ]
})

export class NotificationModule {
}
