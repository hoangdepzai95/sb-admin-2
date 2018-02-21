import { Injectable } from '@angular/core';
import { FilterChildModel } from '@shared/models/filter.child.model';
import { COMPARISON_OPERATORS } from '@shared/modules/filters/filter.operator';
import { FilterModel } from '@shared/models/filter.model';
import { FILTER_BY_USER_STATUS_OPTIONS } from '@shared/static-data/user-status.data';

@Injectable()

export class DemographicListFilterService {
    get filterByStatusData() {

        const children: Array<FilterChildModel> = FILTER_BY_USER_STATUS_OPTIONS.map((item) => {
            return {
                ...item,
                id: `demographic_status_${item.value}`,
                parentId: 'demographic_status',
                field: 'state',
                subField: 'status',
                selfOptions: FILTER_BY_USER_STATUS_OPTIONS,
                operatorOptions: [],
                inputType: 'options',
                inputValue: '',
                operator: 'IN'
            };
        });

        return {
            label: 'common.Status',
            value: 'demographic_status',
            id: 'demographic_status',
            children
        };
    }

    getAppFiltersData(): Array<FilterModel> {
        return [
            {
                label: 'common.CTR',
                value: 'demographic_ctr',
                id: 'demographic_ctr',
                children: [{
                    label: 'common.CTR',
                    value: 'ctr',
                    field: 'ctr',
                    inputType: 'percent',
                    inputValue: '',
                    id: 'demographic_ctr',
                    parentId: 'demographic_ctr',
                    selfOptions: [],
                    operatorOptions: COMPARISON_OPERATORS,
                    subField: '',
                    operator: '>',
                }],
            },
            {
                label: 'campaignsList.Clicks',
                value: 'demographic_clicks',
                id: 'demographic_clicks',
                children: [{
                    label: 'campaignsList.Clicks',
                    value: 'clicks',
                    inputType: 'number',
                    inputValue: '',
                    id: 'demographic_clicks',
                    parentId: 'demographic_clicks',
                    field: 'clicks',
                    operator: '>',
                    selfOptions: [],
                    operatorOptions: COMPARISON_OPERATORS,
                    subField: ''
                }],
            },
            {
                label: 'common.Impressions',
                value: 'demographic_impressions',
                id: 'demographic_impressions',
                children: [{
                    label: 'common.Impressions',
                    value: 'impressions',
                    inputType: 'number',
                    inputValue: '',
                    id: 'demographic_impressions',
                    parentId: 'demographic_impressions',
                    field: 'shows',
                    operator: '>',
                    selfOptions: [],
                    operatorOptions: COMPARISON_OPERATORS,
                    subField: ''
                }],
            }
        ];
    }

    getFullFiltersData(): Array<FilterModel> {
        return [
            this.filterByStatusData,
            ...this.getAppFiltersData()
        ];
    }
}
