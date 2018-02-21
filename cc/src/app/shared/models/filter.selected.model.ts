import { FilterChildModel } from '@shared/models/filter.child.model';

export class FilterSelectedModel {
    field: string;
    operator: string;
    selected: FilterChildModel;
}
