import { Component, HostListener, EventEmitter, Output, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { InlineStatusEditService } from './inline-status-edit.service';
import { USER_STATUS_OPTIONS } from '@shared/static-data/user-status.data';

@Component({
    selector: 'data-table-inline-status-edit',
    templateUrl: './inline-status-edit.template.html',
})

export class InlineStatusEditComponent {

    @Output()
    close =  new EventEmitter<any>();

    @Input()
    id: number;

    @Input()
    endPoint: string;

    @Input()
    updateFunction: Function;

    isEditing = false;

    USER_STATUS_OPTIONS = USER_STATUS_OPTIONS;

    constructor(
        private ref: ElementRef,
        private cdRef: ChangeDetectorRef,
        public service: InlineStatusEditService
    ) {
    }

    async singleEditStatus(status: number) {
        this.isEditing = true;
        await this.service.singleEditStatus(this.endPoint, this.id, status, this.onSuccess.bind(this));
        this.isEditing = false;
        this.cdRef.markForCheck();
    }

    closeEdit() {
        this.close.emit();
    }

    onSuccess(res) {
        this.updateFunction(res);
        this.closeEdit();
    }

    @HostListener('document:click', ['$event'])
    onClickOutSide (e) {
        if (!this.ref.nativeElement.parentNode.contains(e.target)) {
            this.closeEdit();
        }
    }
}

