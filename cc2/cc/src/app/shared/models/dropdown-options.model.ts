export type DropdownValueType = string | number | Array<number>;

export class DropDownItemModel {
    value: DropdownValueType;
    label: string;
    innerHTML?: boolean;
    iconClass?: string;
}

export type DropdownOptionsModel = DropDownItemModel[];
