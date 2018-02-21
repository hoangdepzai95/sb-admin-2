import {
    Component,
    Input,
    Output,
    EventEmitter,
    ElementRef,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef, HostListener
} from '@angular/core';
import { InlineNameEditService } from './inline-name-edit.service';

@Component({
    selector: 'data-table-inline-name-edit',
    templateUrl: './inline-name-edit.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class InlineNameEditComponent implements OnInit {

    @Input()
    initialName: string;

    @Input()
    id: number;

    @Input()
    endPoint: string;

    @Input()
    updateFunction: Function;

    @Output()
    close =  new EventEmitter<any>();

    editingName = '';
    MAX_NAME_LENGTH = 130;
    loading: boolean;

    constructor(private ref: ElementRef, private service: InlineNameEditService, private cdRef: ChangeDetectorRef) {
        this.service.editing.subscribe((value: boolean) => {
            this.loading = value;
            this.cdRef.markForCheck();
        });
    }

    ngOnInit() {
        this.editingName = this.initialName;
        this.ref.nativeElement.querySelector('input').focus();
    }

    cancel() {
        this.close.emit();
    }
    onSuccess(res: any) {
        this.close.emit();
        this.updateFunction(res);
    }

    onEnter() {
        if (this.editingName.trim() && this.editingName.length <= this.MAX_NAME_LENGTH) {
            this.editName();
        }
    }
    editName() {
        this.service.editName(this.endPoint, this.id, this.editingName, this.onSuccess.bind(this));
    }

    @HostListener('document:click', ['$event'])
    onClickOutSide (e) {
        if (!this.ref.nativeElement.parentNode.contains(e.target)) {
            this.close.emit();
        }
    }

}
