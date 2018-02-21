import { Component, Input, ViewChild } from '@angular/core';
import { FilterModel } from '@shared/models/filter.model';
import { NestedDropdownEvent, SelectedNestedDropDownModel } from '@shared/models/nested-dropdown.model';
import { AppFiltersComponent } from '@shared/modules/filters/filters.component';
import { DataTableService } from '@shared/modules/data-table/data-table.service';

@Component({
    selector: 'data-table-top-block',
    templateUrl: 'data-table-top-block.template.html'
})

export class DataTableTopBlockComponent {

    @Input()
    appFilterData: Array<FilterModel>;

    @Input()
    fullFilterData: Array<FilterModel>;

    @Input()
    ignoreFilterIds: Array<string>;

    @Input()
    filterName: string;

    @ViewChild(AppFiltersComponent) appFilterInstance: AppFiltersComponent;

    selectedDropDownData: SelectedNestedDropDownModel[] = [];

    constructor(private dataTableService: DataTableService) {
    }

    onFilterChange() {
        this.dataTableService.getRowsData();
    }

    onSelectFilter(e: NestedDropdownEvent) {
        this.appFilterInstance.onSelectFilter(e);
    }

    onRemoveFilterByDropDown(e: NestedDropdownEvent) {
        this.appFilterInstance.onRemoveFilterByDropdown(e);
    }

    onSelectedDropDownDataChange(e: SelectedNestedDropDownModel[]) {
        this.selectedDropDownData = e;
    }
}
