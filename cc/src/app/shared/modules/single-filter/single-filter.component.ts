import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AppFilterService } from '@shared/modules/filters/filter.service';
import { DataTableService } from '@shared/modules/data-table/data-table.service';
import { SavedFilterModel } from '@shared/models/filter.saved.model';
import { FilterChildModel } from '@shared/models/filter.child.model';
import { DropdownValueType } from '@shared/models/dropdown-options.model';

@Component({
    selector: 'app-single-filter',
    templateUrl: './single-filter.template.html',
})

export class SingleFilterComponent {

    @Input()
    filterData: FilterChildModel[];

    @Input()
    className: string;

    @Input()
    parentId: string;

    savedFilters: Array<SavedFilterModel> = [];

    filterStateSub: Subscription;

    constructor(
        private dataTableService: DataTableService,
        private appFilterService: AppFilterService
    ) {
        this.filterStateSub = this.appFilterService.getSavedFiltersAsObservable().subscribe((value) => {
            this.savedFilters = value;
        });
    }

    onChangeFilter(filterChild: FilterChildModel) {
        this.appFilterService.setFilterState({
            id: filterChild.id,
            parentId: filterChild.parentId,
            value: filterChild.value,
            operator: filterChild.operator
        });
        this.dataTableService.getRowsData();
    }

    getSavedFilter(): DropdownValueType {
        return (this.savedFilters.find(filter => filter.parentId === this.parentId) || { value: ''}).value;
    }
}
