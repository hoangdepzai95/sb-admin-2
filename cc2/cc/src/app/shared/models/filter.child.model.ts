import { DropdownOptionsModel } from '@shared/models/dropdown-options.model';

export class FilterChildModel {
    label: string;
    value: any;
    field: string;
    id: string;
    parentId: string;
    subField: string;
    selfOptions: DropdownOptionsModel;
    operatorOptions: DropdownOptionsModel;
    inputType: string;
    inputValue: string;
    operator: string;
}
