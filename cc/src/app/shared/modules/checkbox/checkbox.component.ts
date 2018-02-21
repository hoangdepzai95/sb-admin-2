import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.template.html'
})

export class CheckboxComponent {

    @Input()
    checked: boolean;

    @Input()
    disabled: boolean;

    @Output()
    change = new EventEmitter<any>();

    onClick() {
        if (!this.disabled) {
            this.change.emit({
                checked: !this.checked,
            });
        }
    }
}
