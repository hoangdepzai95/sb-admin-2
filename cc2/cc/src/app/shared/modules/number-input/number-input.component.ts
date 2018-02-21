import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { numberFormat } from '@src/app/app.utils';
import { parseLikeNumberString } from '@src/app/app.utils';

@Component({
    selector: 'number-input',
    templateUrl: './number-input.template.html'
})

export class NumberInputComponent {

    @Input()
    min: number;

    @Input()
    max: number;

    @Output()
    change = new EventEmitter<any>();

    errors = { min: false, max: false };

    value = '';

    constructor(private ref: ElementRef) {
    }

    get hasErrors(): boolean {
        for (const prop in this.errors) {
            if (this.errors[prop]) {
                return true;
            }
        }

        return false;
    }

    onChange(e) {
        const input = this.ref.nativeElement.querySelector('input');
        const value = parseLikeNumberString(e.target.value);

        if (value !== '') {
            this.value = input.value = numberFormat(value);

        } else {
            this.value = input.value = '';
        }
        this.validate();
        this.change.emit(parseInt(parseLikeNumberString(this.value), 10) || '');
    }

    validate() {
        const value = parseInt(parseLikeNumberString(this.value), 10);
        if (value < this.min) {
            this.errors.min = true;
            return;
        } else {
            this.errors.min = false;
        }

        if (value > this.max) {
            this.errors.max = true;
            return;
        } else {
            this.errors.max = false;
        }
    }

}
