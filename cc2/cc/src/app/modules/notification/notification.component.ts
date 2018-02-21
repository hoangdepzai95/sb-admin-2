import { Component, OnInit } from '@angular/core';
import { remove } from 'lodash';
import { TranslateService } from '@ngx-translate/core';

import { NotificationService } from './notification.service';
import { NotificationModel } from '@shared/models/notification.model';

declare const window: any;
declare const toastr: any;

@Component({
    selector: '[app-notification]',
    templateUrl: './notification.template.html',
})

export class NotificationComponent implements OnInit {

    notifications: NotificationModel[];
    idsProcessing: Array<number> = [];

    constructor(private notificationService: NotificationService, private translate: TranslateService) {
        this.notificationService.notifications.subscribe((notifications) => {
            this.notifications = notifications;
        });
    }

    async markNotificationsAsRead(id: number) {
        if (!this.idsProcessing.find(idProcessing => idProcessing === id)) {
            try {
                this.idsProcessing.push(id);
                await this.notificationService.markAsRead(id);
            } catch (error) {
                toastr.error(this.translate.instant('common.Data handler exception. Please, refresh the page and retry.'));

            }
            this.idsProcessing = remove(this.idsProcessing, id);
        }
    }

    isDisabledDismissBtn(id: number): boolean {
        return !!this.idsProcessing.find(idProcessing => idProcessing === id);
    }

    ngOnInit(): void {
        if (!window.idInterValGetNotification) {
            this.notificationService.getNotifications();
            window.idInterValGetNotification = setInterval(() => {
                this.notificationService.getNotifications();
            }, 30000);
        }
    }
}
