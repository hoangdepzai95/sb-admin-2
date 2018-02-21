import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SavedFilterModel } from '@shared/models/filter.saved.model';
import { Observable } from 'rxjs/Observable';
import { FilterModel } from '@shared/models/filter.model';
import { FilterChildModel } from '@shared/models/filter.child.model';
import { FilterHttpParamsModel } from '@shared/models/filter.http-params.model';

@Injectable()

export class AppFilterService {

    private savedFilters: BehaviorSubject<SavedFilterModel[]> = new BehaviorSubject([]);

    private name: string;

    private filterData: FilterModel[];

    init(name: string, filterData: FilterModel[]) {
        this.name = name;
        this.filterData = filterData;
        this.savedFilters.next(this.getSavedFilters());
    }

    getSavedFiltersAsObservable(): Observable<SavedFilterModel[]> {
        return this.savedFilters.asObservable();
    }

    private getSavedFilters(): Array<SavedFilterModel> {
        try {
            return JSON.parse(localStorage.getItem(`${this.name}_filters`)) || [];
        } catch (err) {
            return [];
        }
    }

    private combineFilters(nextFilter: SavedFilterModel): Array<SavedFilterModel> {
        let newFilters = [];
        const currentFilters = this.savedFilters.getValue();
        const parentNextFilter = this.filterData.find(parentFilter => parentFilter.id === nextFilter.parentId);
        let isSaved = false;

        currentFilters.forEach((filter) => {

            if (
                (parentNextFilter.isMultiFieldGroup && filter.id === nextFilter.id && !isSaved) ||
                (!parentNextFilter.isMultiFieldGroup && filter.parentId === nextFilter.parentId && !isSaved)
            ) {
                newFilters.push(nextFilter);
                isSaved = true;
            } else {
                newFilters.push(filter);
            }
        });

        if (!isSaved) {
            newFilters.push(nextFilter);
        }

        newFilters = newFilters.filter(filter =>
            !(filter.id === 'campaign_name' && !String(filter.value).trim()) &&
            !(filter.parentId === 'campaign_status' && String(filter.value)  === 'all')
        );

        return newFilters;
    }

    setFilterState(filter: SavedFilterModel): void {
        const nextFilters = this.combineFilters(filter);
        localStorage.setItem(`${this.name}_filters`, JSON.stringify(nextFilters));
        this.savedFilters.next(this.getSavedFilters());
    }

    removeFilter(id: string) {
        let savedFilters = this.getSavedFilters();
        savedFilters = savedFilters.filter(filter => filter.id !== id);
        localStorage.setItem(`${this.name}_filters`, JSON.stringify(savedFilters));
        this.savedFilters.next(this.getSavedFilters());
    }

    clearAllFilter(ignoreList: Array<string>) {
        let savedFilters = this.getSavedFilters();
        savedFilters = savedFilters.filter(filter => ignoreList.includes(filter.parentId));
        localStorage.setItem(`${this.name}_filters`, JSON.stringify(savedFilters));
        this.savedFilters.next(savedFilters);
    }

    getChildFilter(childId: string, parentId: string): FilterChildModel {
        const parent = this.filterData.find(filter => filter.id === parentId);
        if (parent) {
            return parent.children.find(child => child.id === childId);
        }
    }

    getFiltersHttpParams(): FilterHttpParamsModel[] {
        let result = this.savedFilters.getValue().map((item) => {
            const filter = this.getChildFilter(item.id, item.parentId);
            if (filter) {
                let field = filter.subField ? `${filter.field}.${filter.subField}` : filter.field;
                const operator = item.operator;
                let value: any = item.value;

                if (filter.inputType === 'percent') {
                    value = value as number / 100;
                }

                if (operator === 'CONTAIN') {
                    value = (value as string || '').trim();
                }

                if (filter.id === 'campaign_id') {
                    value = parseInt(value as string, 10);
                }

                if (filter.parentId === 'campaign_features') {
                    value = true;
                    field = `features.${item.value}`;
                }

                if (!Array.isArray(value)) {
                    value = [value];
                }

                return {
                    field,
                    operator,
                    value
                };
            } else {
                return null;
            }
        });

        result = result.filter(o => !!o);

        return result;
    }
}
