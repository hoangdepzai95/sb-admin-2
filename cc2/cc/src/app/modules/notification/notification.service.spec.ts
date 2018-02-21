import { TestBed, inject, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import * as moment from 'moment';

import { NotificationService } from './notification.service';
import { AppModule } from '../../app.module';

describe('Service: NotificationService', () => {
    let service;
    function testNotificationStructure(notification) {
        expect(typeof notification.id).toBe('number');
        expect(typeof notification.title).toBe('string');
        expect(typeof notification.shortText).toBe('string');
        expect(typeof notification.helpUrl).toBe('string');
        expect(moment(notification.createdAt).isValid()).toBe(true);
        expect(typeof notification.buttonLabel).toBe('string');
        expect(typeof notification.buttonUrl).toBe('string');
    }
    beforeEach(() => TestBed.configureTestingModule({
        imports: [ AppModule, RouterTestingModule ],
        providers: [ NotificationService ]
    }));

    beforeEach(inject([NotificationService], s => {
        service = s;
    }));

    it('get notifications and mark as read should work', async(() => {
        service.getNotifications().then((res) => {
            expect(Array.isArray(res)).toBe(true, 'returned notifications from get request is not array');

            for (const notification of res) {

                testNotificationStructure(notification);

                service.markAsRead(notification.id).then((_res) => {
                    expect(Array.isArray(_res)).toBe(true, 'returned notifications from mark as read is not array');
                    for (const _notification of _res) {
                        testNotificationStructure(_notification);
                    }
                }, () => {
                    fail( 'error in mark as read request');
                });
            }
        }, () => {
            fail('error in get request');
        });
    }));
});
