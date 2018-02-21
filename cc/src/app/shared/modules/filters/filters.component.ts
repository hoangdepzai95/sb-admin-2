import {
    Component,
    Input,
    ElementRef,
    Output,
    ChangeDetectionStrategy,
    OnInit,
    HostListener,
    EventEmitter,
} from '@angular/core';
import { FilterModel } from '@shared/models/filter.model';
import { SavedFilterModel } from '@shared/models/filter.saved.model';
import { FilterUiModel } from './filter-ui.model';
import { DropDownItemModel } from '@shared/models/dropdown-options.model';
import { NestedDropdownEvent } from '@shared/models/nested-dropdown.model';
import { isDescendantNode } from '@src/app/app.utils';
import { TranslateService } from '@ngx-translate/core';
import { IMyDpOptions, IMyDateModel  } from 'mydatepicker';
import * as moment from 'moment';
import { LangService } from '@src/app/lang/lang.service';
import { SelectedNestedDropDownModel } from '@shared/models/nested-dropdown.model';
import { AppFilterService } from './filter.service';
import { AutoUnsubscribe } from '@src/app/app.utils';
import { Subscription } from 'rxjs/Subscription';
import { ADVERT_TYPE_OPTIONS } from '@shared/static-data/advert-type.data';

@Component({
    selector: 'app-filters',
    templateUrl: './filters.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

@AutoUnsubscribe()

export class AppFiltersComponent implements OnInit {

    @Input()
    data: FilterModel[] = [];

    @Input()
    fullData: FilterModel[] = [];

    @Input()
    name: string;

    @Input()
    ignoreList: Array<string> = [] ;

    @Output()
    selectedDropDownDataChange = new EventEmitter<any>();

    @Output()
    filterChange = new EventEmitter<any>();

    _filters: Array<FilterUiModel> = [] ;

    savedFilters: SavedFilterModel[] = [];
    savedFiltersSub: Subscription;

    public myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd.mm.yyyy',
        editableDateField: false,
        showClearDateBtn: false,
        showTodayBtn: false,
        openSelectorOnInputClick: true,
        height: '19px',
        width: '150px',
        selectionTxtFontSize: '13px'
    };

    constructor(
        private element: ElementRef,
        private translate: TranslateService,
        public langService: LangService,
        private service: AppFilterService
    ) {
        this.savedFiltersSub = this.service.getSavedFiltersAsObservable().subscribe((value: SavedFilterModel[]) => {
            this.savedFilters = value;
        });
    }

    get filters(): FilterUiModel[] {
        return this._filters;
    }

    set filters(filters: FilterUiModel[]) {
        this._filters = filters;
        this.selectedDropDownDataChange.emit(this.selectedDropDownData);
    }

    ngOnInit() {
        this.service.init(this.name, this.fullData);
        this.filters = [...this.getSavedFilters()];
    }


    getSavedFilters(): FilterUiModel[] {
        const result = [];
        const filters = this.savedFilters.filter(filter => !this.ignoreList.includes(filter.parentId));

        filters.forEach((filter) => {
            const fullInfoFilter = this.getFilter(filter.id, filter.parentId);
            if (fullInfoFilter) {
                result.push({
                    ...fullInfoFilter.child,
                    label: fullInfoFilter.parent.isMultiFieldGroup ? fullInfoFilter.child.label : fullInfoFilter.parent.label,
                    value: filter.value,
                    operator: filter.operator,
                    saved: true,
                    isEditing: false
                });
            }
        });

        return result;
    }

    onSelectFilter(e: NestedDropdownEvent) {

        this.removeUnsavedFilters();

        const newFilter = {
            ...e.child,
            label: e.item.isMultiFieldGroup ? e.child.label : e.item.label,
            value: e.child.inputType === 'options' ? e.child.value : e.child.inputValue,
            saved: false,
            isEditing: true
        };

        const siblingFilter = this.filters.find(filter => filter.parentId === newFilter.parentId);
        const selectedFilter = this.filters.find(filter => filter.id === newFilter.id);

        if (newFilter.inputType === 'options' && siblingFilter) {
            this.onChangeFilterWithOptionsInput(siblingFilter, { label: '', value: newFilter.value });
        } else if (selectedFilter) {
            this.switchFromSavedToEditing(selectedFilter.id);
        } else {
            this.filters = [newFilter, ...this.filters];
        }

        if (newFilter.inputType === 'options') {
            this.onSaveFilter(siblingFilter || newFilter);
        }

        this.focusInput();
    }

    onSaveFilter(filter: FilterUiModel) {

        this.inMemorySaveFilter(filter.id);

        this.service.setFilterState({
            id: filter.id,
            parentId: filter.parentId,
            value: filter.value,
            operator: filter.operator
        });

        this.switchFromEditingToSaved(filter.id);
        this.filterChange.emit();
    }

    get isHaveUnSavedFilter(): boolean {
        return !!(this.filters.find(filter => !filter.saved) || this.filters.find(filter => filter.saved && filter.isEditing));
    }

    removeUnsavedFilters() {
        let filters = [...this.filters];
        filters = filters.filter(filter => filter.saved);
        this.filters = filters.map((filter) => {
            if (filter.saved && filter.isEditing) {
                filter.value = this.savedFilters.find(o => o.id === filter.id).value;
                filter.isEditing = false;
            }
            return filter;
        });
    }

    inMemorySaveFilter(filterId: string) {
        this.filters = this.filters.map((filter) => {
            if (filter.id === filterId) {
                filter.saved = true;
            }

            return filter;
        });
    }

    onRemoveFilter(filter: FilterUiModel) {
        if (filter.saved) {
           this.service.removeFilter(filter.id);
        }

        this.filters = this.filters.filter(item => item.id !== filter.id);
        this.filterChange.emit();
    }

    onRemoveFilterByDropdown(e: NestedDropdownEvent) {
        let filter;

        if (e.child.inputType === 'options') {
            filter = this.filters.find(o => o.parentId === e.child.parentId && o.value === e.child.value);
        } else  {
            filter = this.filters.find(o => o.id === e.child.id);
        }

        if (filter) {
            this.onRemoveFilter(filter);
        }
    }

    onClearAllFilter() {
        this.filters = [];
        this.service.clearAllFilter(this.ignoreList);
        this.filterChange.emit();
    }

    onChangeFilterWithOptionsInput(targetFilter: FilterUiModel, e: DropDownItemModel) {
        const newFilters = this.filters.map((filter) => {
            if (targetFilter.id === filter.id) {
                filter.value = e.value;
            }

            return filter;
        });

        this.filters = newFilters;
    }

    onChangeFilterValue(filterId: string, e) {
        const newFilters = this.filters.map((filter) => {
            if (filter.id === filterId) {
                filter.value = e.target.value;
            }

            return filter;
        });

        this.filters = newFilters;
    }

    getFilter(childId: string, parentId: string) {
        const parentFilter = this.data.find(filter => filter.id === parentId);
        let childFilter;
        if (parentFilter) {
            childFilter = parentFilter.children.find(child => child.id === childId);
        }

        return { parent: parentFilter, child: childFilter };
    }

    focusInput() {
        setTimeout(() => {
            const input = this.element.nativeElement.querySelector('input');
            if (input) {
                input.focus();
            }
        });
    }

    switchFromSavedToEditing(filterId: string) {

        this.filters = this.filters.map((filter) => {
            if (filter.id === filterId && filter.saved) {
                filter.isEditing = true;
            }

            return filter;
        });

        this.focusInput();
    }

    switchFromEditingToSaved(filterId: string) {

        this.filters = this.filters.map((filter) => {
            if (filter.id === filterId) {
                filter.isEditing = false;
            }

            return filter;
        });
    }

    getCampaignTypeLabel(value: string): string {
        const type = ADVERT_TYPE_OPTIONS.find(item => item.value === +value);
        return type ? type.label : '';
    }

    getSavedFilterValue(filter: FilterUiModel): string {
        let value;

        if (filter.parentId === 'campaign_type') {
            value = this.translate.instant(this.getCampaignTypeLabel(filter.value.toString()));
        } else if (filter.inputType === 'percent') {
            value = `${filter.value}%`;
        } else if (filter.inputType === 'date') {
            value = moment(filter.value, 'YYYY-MM-DD').format('DD.MM.YYYY');
        } else {
            value = filter.value;
        }

        return value;
    }

    getOperatorLabel(filter: FilterUiModel) {
        if (filter.operatorOptions.length) {
            const operator: DropDownItemModel = filter.operatorOptions.find(item => item.value === filter.operator);
            return this.translate.instant(operator.label);
        } else {
            return filter.operator;
        }
    }

    onChangeOperator(targetedFilter: FilterUiModel, e: DropDownItemModel) {
        this.filters = this.filters.map((filter) => {
            if (filter.id === targetedFilter.id) {
                filter.operator = String(e.value);
            }

            return filter;
        });

        this.focusInput();
    }

    onDateFilterChanged(filterId: string, e: IMyDateModel) {
        this.filters = this.filters.map((filter) => {
            if (filter.id === filterId) {
                filter.value = moment(e.epoc, 'X').format('YYYY-MM-DD');
            }

            return filter;
        });
    }

    get selectedDropDownData(): SelectedNestedDropDownModel[] {
        return this.filters.map((filter) => {
            const fullInfoFilter = this.getFilter(filter.id, filter.parentId);
            return {
                parentValue: fullInfoFilter.parent.value,
                childValue: filter.inputType === 'options' ? filter.value : fullInfoFilter.child.value
            };
        });
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(e: Event) {
        if (this.isHaveUnSavedFilter && !isDescendantNode('filters-item', e.target)) {
              this.removeUnsavedFilters();
        }
    }
}
