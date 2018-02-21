import { Component, Input, Output, ChangeDetectorRef, ElementRef, EventEmitter } from '@angular/core';
import { NestedDropdownDataModel, ChildNestedDropdownModel } from '@src/app/shared/models/nested-dropdown.model';
import { SelectedNestedDropDownModel } from '@src/app/shared/models/nested-dropdown.model';

@Component({
    selector: 'app-nested-dropdown',
    templateUrl: './nested-dropdown.template.html',
})

export class NestedDropdownComponent {

    @Input()
    data: NestedDropdownDataModel;

    @Input()
    btnLabel: string;

    @Input()
    selected: SelectedNestedDropDownModel[];

    @Output()
    select = new EventEmitter<any>();

    @Output()
    remove = new EventEmitter<any>();

    openedItem: ChildNestedDropdownModel = { value: '', label: '' };
    isOpen: boolean;

    constructor(private element: ElementRef, private cdRef: ChangeDetectorRef) {
    }

    onClickItem(item: NestedDropdownDataModel, e: Event, isSelected: boolean) {
        if (item.value === this.openedItem.value) {
             this.openedItem = { value: '', label: '' };
        } else {
            this.openedItem = item;
        }

        if (item.children.length < 2) {
            const data = {
                item: item,
                child: item.children[0]
            };

            if (isSelected) {
                this.remove.emit(data);
            } else {
                this.select.emit(data);
            }
        }
        e.stopPropagation();
    }

    onSelectedChildren(child: ChildNestedDropdownModel, parent: NestedDropdownComponent, e: Event, isSelected: boolean) {
        e.stopPropagation();
        const data = {
            item: parent,
            child
        };

        if (isSelected) {
            this.remove.emit(data);
        } else {
            this.select.emit(data);
        }
    }

    toggleDropdown(): void {
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

    trackByValue(item: ChildNestedDropdownModel) {
        return item.value;
    }

    onClickOutSide = (e) => {
        if (!this.isOpen) {
            return;
        }
        if (!this.element.nativeElement.contains(e.target)) {
            this.closeDropdown();
        }
    }

    isParentSelected(parentValue: string): boolean {
        return !!this.selected.find(selected => selected.parentValue === parentValue);
    }

    isChildSelected(childValue: string, parentValue: string): boolean {
        return !!this.selected.find(selected => selected.parentValue === parentValue && selected.childValue === childValue);
    }

}
