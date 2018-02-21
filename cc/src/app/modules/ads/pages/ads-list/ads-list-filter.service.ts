import { Injectable } from '@angular/core';
import { FilterChildModel } from '@shared/models/filter.child.model';
import { COMPARISON_OPERATORS } from '@shared/modules/filters/filter.operator';
import { FilterModel } from '@shared/models/filter.model';
import { FILTER_BY_USER_STATUS_OPTIONS } from '@shared/static-data/user-status.data';

@Injectable()

export class AdsListFilterService {
    get filterByStatusData() {

        const children: Array<FilterChildModel> = FILTER_BY_USER_STATUS_OPTIONS.map((item) => {
            return {
                ...item,
                id: `advert_status_${item.value}`,
                parentId: 'advert_status',
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
            value: 'advert_status',
            id: 'advert_status',
            children
        };
    }

    getAppFiltersData(): Array<FilterModel> {
        return [
            {
                label: 'common.CTR',
                value: 'advert_ctr',
                id: 'advert_ctr',
                children: [{
                    label: 'common.CTR',
                    value: 'ctr',
                    field: 'ctr',
                    inputType: 'percent',
                    inputValue: '',
                    id: 'advert_ctr',
                    parentId: 'advert_ctr',
                    selfOptions: [],
                    operatorOptions: COMPARISON_OPERATORS,
                    subField: '',
                    operator: '>',
                }],
            },
            {
                label: 'campaignsList.Clicks',
                value: 'advert_clicks',
                id: 'advert_clicks',
                children: [{
                    label: 'campaignsList.Clicks',
                    value: 'clicks',
                    inputType: 'number',
                    inputValue: '',
                    id: 'advert_clicks',
                    parentId: 'advert_clicks',
                    field: 'clicks',
                    operator: '>',
                    selfOptions: [],
                    operatorOptions: COMPARISON_OPERATORS,
                    subField: ''
                }],
            },
            {
                label: 'common.Impressions',
                value: 'advert_impressions',
                id: 'advert_impressions',
                children: [{
                    label: 'common.Impressions',
                    value: 'impressions',
                    inputType: 'number',
                    inputValue: '',
                    id: 'advert_impressions',
                    parentId: 'advert_impressions',
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
