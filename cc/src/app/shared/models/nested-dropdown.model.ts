export class ChildNestedDropdownModel {
    label: string;
    value: any;
}

export class NestedDropdownDataModel {
    label: string;
    value: string;
    children: ChildNestedDropdownModel[];
}

export class SelectedNestedDropDownModel {
    parentValue: string;
    childValue: string;
}

export class NestedDropdownEvent {
    item: any;
    child: any;
}
