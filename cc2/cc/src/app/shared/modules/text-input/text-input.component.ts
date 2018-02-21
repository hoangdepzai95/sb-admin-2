import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
    selector: 'text-input',
    templateUrl: './text-input.template.html'
})

export class TextInputComponent {

    @Input()
    required = true;

    @Input()
    maxLength: number;

    @Input()
    placeHolder = '';

    @Input()
    errorText = '';

    @Input()
    validateFunction: Function;

    @Output()
    change = new EventEmitter<any>();

    @Output()
    errorStateChange = new EventEmitter<any>();

    value = '';

    errors = { required: false, maxLength: false, customError: false };

    get hasErrors(): boolean {
        for (const prop in this.errors) {
            if (this.errors[prop]) {
                return true;
            }
        }

        return false;
    }

    onChange(e) {
        const value = e.target.value;
        this.change.emit(value);
        this.value = value;
        this.validate();
    }

    validate() {

        if (!this.required && !this.value) {
            this.errors = { required: false, maxLength: false, customError: false };
            this.errorStateChange.emit(false);
            return;
        }

        if (typeof this.validateFunction === 'function') {
            if (!this.validateFunction(this.value)) {
                this.errors.customError = true;
                this.errorStateChange.emit(true);
                return;
            } else {
                this.errors.customError = false;
            }
        }

        if (!this.value || (this.value && !this.value.trim())) {
            this.errors.required = true;
            this.errors.maxLength = false;
            this.errorStateChange.emit(true);
            return;
        } else {
            this.errors.required = false;
        }

        if (this.maxLength && this.value.length > this.maxLength) {
            this.errors.maxLength = true;
            this.errorStateChange.emit(true);
            return;
        } else {
            this.errors.maxLength = false;
        }

        this.errorStateChange.emit(false);
    }

}
