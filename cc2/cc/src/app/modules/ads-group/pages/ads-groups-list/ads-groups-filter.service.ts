import { Injectable } from '@angular/core';
import { FilterChildModel } from '@shared/models/filter.child.model';
import { FilterModel } from '@shared/models/filter.model';
import { COMPARISON_OPERATORS } from '@shared/modules/filters/filter.operator';
import { FILTER_BY_USER_STATUS_OPTIONS } from '@shared/static-data/user-status.data';

@Injectable()

export class AdsGroupsFilterService {

    get filterByStatusData() {

        const children: Array<FilterChildModel> = FILTER_BY_USER_STATUS_OPTIONS.map((item) => {
            return {
                ...item,
                id: `ads_group_status_${item.value}`,
                parentId: 'ads_group_status',
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
            value: 'ads_group_status',
            id: 'ads_group_status',
            children
        };
    }

    getAppFiltersData(): Array<FilterModel> {
        return [
            {
                label: 'common.Ads group name',
                value: 'ads_group_name',
                id: 'ads_group_name',
                children: [{
                    label: 'common.Ads group name',
                    value: 'ads_group_name',
                    inputType: 'text',
                    inputValue: '',
                    id: 'ads_group_name',
                    parentId: 'ads_group_name',
                    field: 'details',
                    operator: 'CONTAIN',
                    selfOptions: [],
                    operatorOptions: [],
                    subField: 'name'
                }],
            },
            {
                label: 'common.CTR',
                value: 'ads_group_ctr',
                id: 'ads_group_ctr',
                children: [{
                    label: 'common.CTR',
                    value: 'ctr',
                    field: 'ctr',
                    inputType: 'percent',
                    inputValue: '',
                    id: 'ads_group_ctr',
                    parentId: 'ads_group_ctr',
                    selfOptions: [],
                    operatorOptions: COMPARISON_OPERATORS,
                    subField: '',
                    operator: '>',
                }],
            },
            {
                label: 'campaignsList.Clicks',
                value: 'ads_group_clicks',
                id: 'ads_group_clicks',
                children: [{
                    label: 'campaignsList.Clicks',
                    value: 'clicks',
                    inputType: 'number',
                    inputValue: '',
                    id: 'ads_group_clicks',
                    parentId: 'ads_group_clicks',
                    field: 'clicks',
                    operator: '>',
                    selfOptions: [],
                    operatorOptions: COMPARISON_OPERATORS,
                    subField: ''
                }],
            },
            {
                label: 'common.Impressions',
                value: 'ads_group_impressions',
                id: 'ads_group_impressions',
                children: [{
                    label: 'common.Impressions',
                    value: 'impressions',
                    inputType: 'number',
                    inputValue: '',
                    id: 'ads_group_impressions',
                    parentId: 'ads_group_impressions',
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
