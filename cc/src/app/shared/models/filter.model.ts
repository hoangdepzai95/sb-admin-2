import { FilterChildModel } from '@shared/models/filter.child.model';

export class FilterModel {
    id: string;
    label: string;
    value: string;
    isMultiFieldGroup?: boolean;
    children: FilterChildModel[];
}
