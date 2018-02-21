import { DropdownValueType } from '@shared/models/dropdown-options.model';

export class SavedFilterModel {
    id: string;
    parentId: string;
    operator: string;
    value: DropdownValueType;
}
