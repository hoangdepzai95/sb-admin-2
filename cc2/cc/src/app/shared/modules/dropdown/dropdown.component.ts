import { Component, Input, ElementRef, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef  } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { DropDownItemModel } from '@shared/models/dropdown-options.model';

@Component({
    selector: 'app-dropdown',
    templateUrl: './dropdown.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DropdownComponent {

    isOpen: boolean;
    selectedItem: any = {};

    constructor(
        private element: ElementRef,
        private translate: TranslateService,
        private cdRef: ChangeDetectorRef ) {
    }

    @Input()
    data: Array<{ label: string; value: string }>;

    @Input()
    value: string;

    @Input()
    btnClass = 'btn-white';

    @Input()
    classes: Array<string> = [];

    @Input()
    fixedLabel: string;

    @Input()
    disabled: boolean;

    @Input()
    preRender = true;

    @Output()
    select = new EventEmitter<any>();

    @Output()
    open = new EventEmitter<any>();

    isEqualArray(arr1, arr2) {
        if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
            return false;
        }
        // shallow compare
        return arr1.join(',') === arr2.join(',');
    }
    getSelectedItemLabel(value) {
        let selectedItem;
        if (Array.isArray(value)) {
            selectedItem = this.data.find(item => this.isEqualArray(item.value, value));
        } else {
            selectedItem = this.data.find(item => item.value === value);
        }

        selectedItem = selectedItem || this.data[0];
        return selectedItem.noTranslate ? selectedItem.label : this.translate.instant(selectedItem.label);
    }

    toggleDropdown(): void {
        if (!this.isOpen) {
            this.open.emit();
        }

        if (this.disabled) {
            return;
        }

        if (this.isOpen) {
            this.closeDropdown();
        } else {
            this.openDropDown();
        }
    }

    openDropDown() {
        this.isOpen = true;
        this.addEventListener();
    }

    closeDropdown() {
        this.isOpen = false;
        this.cdRef.markForCheck();
        this.removeEventListener();
    }

    selectItem(item): void {
        this.isOpen = false;
        this.select.emit(item);
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
        if (this.isOpen && e.keyCode === 27) {
            this.closeDropdown();
        }
    }

    onClickOutSide = (e) => {
        if (!this.isOpen) {
            return;
        }
        if (!this.element.nativeElement.contains(e.target)) {
            this.closeDropdown();
        }
    }

    trackByValue(item: DropDownItemModel) {
        return item.value;
    }

}
