import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorNotifyService } from '@shared/services/error-notify.service';

declare const toastr: any;

@Injectable()

export class InlineNameEditService {

    editing = new BehaviorSubject(false);

    constructor(private http: HttpClient, private errorService: ErrorNotifyService) {
    }

    editName(endPoint: string, id: number, newName: string, onSuccess: Function) {
        this.editing.next(true);
        this.http.post(endPoint, {
            name: newName,
            id
        }).toPromise()
            .then((res: any) => {
                this.editing.next(false);
                onSuccess(res);
                toastr.success(res.success_msg);
            })
            .catch((err) => {
                console.log(err);
                this.editing.next(false);
                this.errorService.show();
            });
    }
}
