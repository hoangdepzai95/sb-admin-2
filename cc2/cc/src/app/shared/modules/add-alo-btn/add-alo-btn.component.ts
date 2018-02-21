import {
    Component,
    OnInit,
    OnDestroy,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
    ViewChildren,
    QueryList,
    ChangeDetectorRef
} from '@angular/core';
import { AddAloBtnService } from './add-alo-btn.service';
import { EmailModel, ManagerModel } from '@shared/modules/add-alo-btn/add-alo-btn.model';
import { AutoUnsubscribe } from '@src/app/app.utils';
import { TextInputComponent } from '@shared/modules/text-input/text-input.component';
import { ScheduleOptionModel } from '@shared/models/schedule-option.model';
import * as JsUtil from '@shared/shared-function/util.js';
import { LocationModel } from '@shared/models/location.model';

declare const toastr: any;

@AutoUnsubscribe()

@Component({
    selector: 'add-alo-btn',
    templateUrl: './add-alo-btn.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AddAloBtnComponent implements OnInit, OnDestroy {

    @Output()
    showInAdvertChange = new EventEmitter<any>();

    @Output()
    showOnSiteChange = new EventEmitter<any>();

    @Output()
    buttonChange = new EventEmitter<any>();

    @ViewChildren(TextInputComponent) textInputs: QueryList<TextInputComponent>;

    showInAdvert: boolean;

    showOnSite: boolean;

    creatingNew: boolean;

    allWorkingDay: boolean;

    createRequestSending: boolean;

    validatePhoneNumber = JsUtil.validatePhoneNumber;

    validateEmail = JsUtil.validateEmail;

    emailList: EmailModel[] = [{ id: 1, value: '' }];
    managerList: ManagerModel[] = [{ id: 1, name: '', phone: '' }];

    selectedButton: number;

    location = { x: 0, y: 0 };

    constructor(public service: AddAloBtnService, private cdRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.service.getAloBtnList();
    }

    ngOnDestroy() {
        this.service.setAloButtons([]);
    }

    toggleShowInAdvert(e) {
        this.showInAdvert = e.checked;
        this.showInAdvertChange.emit(this.showInAdvert);
    }

    toggleShowOnSite(e) {
        this.showOnSite = e.checked;
        this.showOnSiteChange.emit(this.showOnSite);
    }

    toggleAllWorkingDay(e) {
        this.allWorkingDay = e.checked;
    }

    changeCreating(value: boolean) {
        this.creatingNew = value;
    }

    trackByValue(item) {
        return item.value;
    }

    trackById(item) {
        return item.id;
    }

    cancel() {
        this.creatingNew = false;
    }

    addBlankEmail() {
        this.emailList = [...this.emailList, { id: this.emailList.length + 1, value: '' }];
    }

    addBlankManager() {
        this.managerList = [...this.managerList, { id: this.managerList.length + 1, name: '', phone: '' }];
    }

    removeEmail(id: number) {
        this.emailList = this.emailList.filter(email => email.id !== id);
    }

    removeManager(id: number) {
        this.managerList = this.managerList.filter(manager => manager.id !== id);
    }

    onChangeEmail(id: number, value: string) {
        this.emailList = this.emailList.map((email: EmailModel) => {
            if (email.id === id) {
                email.value = value;
            }
            return email;
        });
    }

    onChangeManager(id: number, field: string, value: string) {
        this.managerList = this.managerList.map((manager: ManagerModel) => {
            if (manager.id === id) {
                manager[field] = value;
            }
            return manager;
        });
    }

    get hasError(): boolean {
        let error = false;
        this.textInputs.forEach((instance: TextInputComponent) => {
            if (instance.hasErrors) {
                error = true;
            }
        });

        this.service.getScheduleOptionsValue(this.allWorkingDay).forEach((scheduleOption: ScheduleOptionModel) => {
            if (scheduleOption.error) {
                error = true;
            }
        });

        return error;
    }

    async create() {
        this.textInputs.forEach((instance: TextInputComponent) => {
            instance.validate();
        });

        if (!this.hasError) {
            this.createRequestSending = true;

            await this.service.createNewButton();

            this.createRequestSending = false;

            setTimeout(() => {
                this.creatingNew = false;
                this.cdRef.markForCheck();
            }, 50);
            this.creatingNew = false;
            this.cdRef.markForCheck();

        } else {
            toastr.warning('Invalid fields');
        }
    }

   selectButton(value: number) {
        this.selectedButton = value;
        this.buttonChange.emit(value);
   }

   onLocationChange(location: LocationModel) {
        this.location = location;
   }

}
