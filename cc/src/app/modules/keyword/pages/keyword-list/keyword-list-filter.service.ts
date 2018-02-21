import { Injectable } from '@angular/core';
import { FilterChildModel } from '@shared/models/filter.child.model';
import { COMPARISON_OPERATORS } from '@shared/modules/filters/filter.operator';
import { FilterModel } from '@shared/models/filter.model';
import { FILTER_BY_USER_STATUS_OPTIONS } from '@shared/static-data/user-status.data';

@Injectable()

export class KeywordListFilterService {
    get filterByStatusData() {

        const children: Array<FilterChildModel> = FILTER_BY_USER_STATUS_OPTIONS.map((item) => {
            return {
                ...item,
                id: `keyword_status_${item.value}`,
                parentId: 'keyword_status',
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
            value: 'keyword_status',
            id: 'keyword_status',
            children
        };
    }

    getAppFiltersData(): Array<FilterModel> {
        return [
            {
                label: 'common.CTR',
                value: 'keyword_ctr',
                id: 'keyword_ctr',
                children: [{
                    label: 'common.CTR',
                    value: 'ctr',
                    field: 'ctr',
                    inputType: 'percent',
                    inputValue: '',
                    id: 'keyword_ctr',
                    parentId: 'keyword_ctr',
                    selfOptions: [],
                    operatorOptions: COMPARISON_OPERATORS,
                    subField: '',
                    operator: '>',
                }],
            },
            {
                label: 'campaignsList.Clicks',
                value: 'keyword_clicks',
                id: 'keyword_clicks',
                children: [{
                    label: 'campaignsList.Clicks',
                    value: 'clicks',
                    inputType: 'number',
                    inputValue: '',
                    id: 'keyword_clicks',
                    parentId: 'keyword_clicks',
                    field: 'clicks',
                    operator: '>',
                    selfOptions: [],
                    operatorOptions: COMPARISON_OPERATORS,
                    subField: ''
                }],
            },
            {
                label: 'common.Impressions',
                value: 'keyword_impressions',
                id: 'keyword_impressions',
                children: [{
                    label: 'common.Impressions',
                    value: 'impressions',
                    inputType: 'number',
                    inputValue: '',
                    id: 'keyword_impressions',
                    parentId: 'keyword_impressions',
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
