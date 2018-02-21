import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { map } from 'lodash';

import { NotificationModel } from '@shared/models/notification.model';
import { NOTIFICATION_GET_ENDPOINT, NOTIFICATION_READ_ENDPOINT } from '../../app.constant';

@Injectable()
export class NotificationService {

    private _notifications: BehaviorSubject<NotificationModel[]> = new BehaviorSubject([]);

    constructor(private http: HttpClient) {
    }

    get notifications(): Observable<NotificationModel[]> {
        return this._notifications.asObservable();
    }

    getNotifications() {
        return this.http.get(NOTIFICATION_GET_ENDPOINT)
            .toPromise()
            .then((res) => {
                this._notifications.next(this.formatNotifications(res));
                return res;
            });
    }

    formatNotifications(data): NotificationModel[] {
        return map(data, (notify) => {
            notify.fromNow = moment(notify.createdAt, 'YYYY-MM-DD hh:mm:ss').fromNow();
            return notify;
        });
    }

    markAsRead(id: number): Promise<any> {
        return this.http.post(NOTIFICATION_READ_ENDPOINT, { id })
            .toPromise()
            .then((res) => {
                this._notifications.next(this.formatNotifications(res));
                return res;
            });

    }
}
