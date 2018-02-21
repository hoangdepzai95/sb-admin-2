import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { DropDownItemModel, DropdownOptionsModel } from '@shared/models/dropdown-options.model';

@Component({
    selector: 'auto-complete',
    templateUrl: './auto-complete.template.html'
})

export class AutoCompleteComponent {

    @Input()
    data: DropdownOptionsModel = [
        {
            label: 'mot',
            value: 1,
            iconClass: 'fa fa-map-marker'
        },
        {
            label: 'hai',
            value: 2,
            iconClass: 'fa fa-map-marker'
        }
    ];

    @Input()
    placeHolder = '';

    @Input()
    clearOnSelect = true;

    @Input()
    loading: boolean;

    @Output()
    select = new EventEmitter<any>();

    @Output()
    getData = new EventEmitter<any>();

    open: boolean;

    inputValue = '';

    focusIndex = -1;

    constructor(private element: ElementRef) {
    }

    openDropDown() {
        this.open = true;
        this.focusIndex = -1;
    }

    onFocusInput() {
        this.openDropDown();
        this.addEventListener();
    }

    selectItem(item: DropDownItemModel) {
        this.select.emit(item);
        this.inputValue = item.label;
        this.open = false;

        if (this.clearOnSelect) {
            this.inputValue = '';
        }
    }

    addEventListener() {
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('click', this.onClickOutSide);
    }

    removeEventListener() {
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('click', this.onClickOutSide);
    }

    onKeyDown = (e) => {
        if (this.open && e.keyCode === 27) {
            this.open = false;
        }
    }

    onClickOutSide = (e) => {
        if (!this.open) {
            return;
        }
        if (!this.element.nativeElement.contains(e.target)) {
            this.open = false;
        }
    }

    onInputChange() {
        this.getData.emit(this.inputValue);
    }

    trackByValue(item: DropDownItemModel) {
        return item.value;
    }

    onKeyDownInput(e) {
        if (e.keyCode === 40) {
            this.focusIndex = this.focusIndex + 1;
            if (this.focusIndex >= this.data.length) {
                this.focusIndex = 0;
            }
        }

        if (e.keyCode === 38) {
            this.focusIndex = this.focusIndex - 1;
            if (this.focusIndex <= -1) {
                this.focusIndex = this.data.length - 1;
            }
        }
    }

    onEnter() {
        if (this.focusIndex !== -1) {
            this.selectItem(this.data[this.focusIndex]);
        }
    }

    onMouseEnterItem(i: number) {
        this.focusIndex = i;
    }

}
