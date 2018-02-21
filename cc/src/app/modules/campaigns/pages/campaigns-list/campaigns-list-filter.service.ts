import { Injectable } from '@angular/core';
import { DropdownOptionsModel } from '@shared/models/dropdown-options.model';
import { FilterModel } from '@shared/models/filter.model';
import { FilterChildModel } from '@shared/models/filter.child.model';
import { COMPARISON_OPERATORS, COMPARISON_DATE_OPERATORS } from '@shared/modules/filters/filter.operator';
import { ADVERT_TYPE_OPTIONS } from '@shared/static-data/advert-type.data';
import { FILTER_BY_USER_STATUS_OPTIONS } from '@shared/static-data/user-status.data';

@Injectable()

export class CampaignsListFilterService {

    get featureOptions(): DropdownOptionsModel {
        return [
            {
                label: 'common.Feed',
                value: 'feed',
            },
            {
                label: 'common.Alo',
                value: 'alo',
            }
        ];
    }

    get filterByStatusData(): FilterModel {

        const children: Array<FilterChildModel> = FILTER_BY_USER_STATUS_OPTIONS.map((item) => {
            return {
                ...item,
                id: `campaign_status_${item.value}`,
                parentId: 'campaign_status',
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
            value: 'campaign_status',
            id: 'campaign_status',
            isMultiFieldGroup: false,
            children
        };
    }

    get filterByFeaturesData(): FilterModel {

        const children: Array<FilterChildModel> = this.featureOptions.map((item) => {
            return {
                ...item,
                id: `campaign_features_${item.value}`,
                parentId: 'campaign_features',
                field: 'features',
                subField: String(item.value),
                selfOptions: this.featureOptions,
                operatorOptions: [],
                inputType: 'options',
                inputValue: '',
                operator: 'IN'
            };
        });
        return {
            label: 'campaignsList.Features',
            value: 'campaign_features',
            id: 'campaign_features',
            isMultiFieldGroup: false,
            children
        };
    }

    get filterByTypeData(): FilterModel {

        const children: Array<FilterChildModel> = ADVERT_TYPE_OPTIONS.map((item) => {
            return {
                ...item,
                id: `campaign_type_${item.value}`,
                parentId: 'campaign_type',
                inputType: 'options',
                selfOptions: ADVERT_TYPE_OPTIONS,
                operatorOptions: [],
                field: 'details',
                subField: 'type',
                inputValue: '',
                operator: 'IN'
            };
        });

        return {
            label: 'common.Campaign type',
            value: 'campaign_type',
            id: 'campaign_type',
            isMultiFieldGroup: false,
            children
        };
    }

    get filterByMetricsData(): FilterModel {
        return {
            label: 'common.Campaign metrics',
            value: 'campaign_metrics',
            id: 'campaign_metrics',
            isMultiFieldGroup: true,
            children: [
                {
                    label: 'common.CTR',
                    value: 'ctr',
                    field: 'ctr',
                    inputType: 'percent',
                    inputValue: '',
                    id: 'campaign_ctr',
                    parentId: 'campaign_metrics',
                    selfOptions: [],
                    operatorOptions: COMPARISON_OPERATORS,
                    subField: '',
                    operator: '>',
                },
                {
                    label: 'campaignsList.Clicks',
                    value: 'clicks',
                    inputType: 'number',
                    inputValue: '',
                    id: 'campaign_clicks',
                    parentId: 'campaign_metrics',
                    field: 'clicks',
                    operator: '>',
                    selfOptions: [],
                    operatorOptions: COMPARISON_OPERATORS,
                    subField: ''
                },
                {
                    label: 'common.Impressions',
                    value: 'impressions',
                    inputType: 'number',
                    inputValue: '',
                    id: 'campaign_impressions',
                    parentId: 'campaign_metrics',
                    field: 'shows',
                    operator: '>',
                    selfOptions: [],
                    operatorOptions: COMPARISON_OPERATORS,
                    subField: ''
                },
                {
                    label: 'common.Avg.CPM (VND)',
                    value: 'averageCPC',
                    inputType: 'number',
                    inputValue: '',
                    id: 'campaign_avg.cpc',
                    parentId: 'campaign_metrics',
                    field: 'averageCost',
                    operator: '>',
                    selfOptions: [],
                    operatorOptions: COMPARISON_OPERATORS,
                    subField: ''
                },
                {
                    label: 'common.Avg.CPC (VND)',
                    value: 'averageCPM',
                    inputType: 'number',
                    inputValue: '',
                    id: 'campaign_avg.cpm',
                    parentId: 'campaign_metrics',
                    field: 'averageCost',
                    operator: '>',
                    selfOptions: [],
                    operatorOptions: COMPARISON_OPERATORS,
                    subField: ''
                },
            ]
        };
    }

    getAppFiltersData(): Array<FilterModel> {

        return [
            this.filterByTypeData,
            this.filterByFeaturesData,
            this.filterByMetricsData,
            {
                label: 'common.Campaign ID',
                value: 'campaign_id',
                id: 'campaign_id',
                isMultiFieldGroup: false,
                children: [{
                    label: 'common.Campaign ID',
                    value: 'campaign_id',
                    inputType: 'number',
                    inputValue: '',
                    id: 'campaign_id',
                    parentId: 'campaign_id',
                    field: 'campaignId',
                    operator: 'IN',
                    selfOptions: [],
                    operatorOptions: [],
                    subField: ''
                }],
            },
            {
                label: 'common.Campaign name',
                value: 'campaign_name',
                id: 'campaign_name',
                isMultiFieldGroup: false,
                children: [{
                    label: 'common.Campaign name',
                    value: 'campaign_name',
                    inputType: 'text',
                    inputValue: '',
                    id: 'campaign_name',
                    parentId: 'campaign_name',
                    field: 'details',
                    operator: 'CONTAIN',
                    selfOptions: [],
                    operatorOptions: [],
                    subField: 'name'
                }],
            },
            {
                label: 'common.Start date',
                value: 'campaign_start_date',
                id: 'campaign_start_date',
                isMultiFieldGroup: false,
                children: [{
                    label: 'Start date',
                    value: 'campaign_start_date',
                    inputType: 'date',
                    inputValue: '',
                    id: 'campaign_start_date',
                    parentId: 'campaign_start_date',
                    field: 'timeStart',
                    operator: '>',
                    selfOptions: [],
                    operatorOptions: COMPARISON_DATE_OPERATORS,
                    subField: ''
                }],
            },
            {
                label: 'common.End date',
                value: 'campaign_end_date',
                id: 'campaign_end_date',
                isMultiFieldGroup: false,
                children: [{
                    label: 'End date',
                    value: 'campaign_end_date',
                    inputType: 'date',
                    inputValue: '',
                    id: 'campaign_end_date',
                    parentId: 'campaign_end_date',
                    field: 'timeEnd',
                    operator: '>',
                    selfOptions: [],
                    operatorOptions: COMPARISON_DATE_OPERATORS,
                    subField: ''
                }],
            },
        ];
    }

    getFullFiltersData(): Array<FilterModel> {
        return [...this.getAppFiltersData(), this.filterByStatusData];
    }
}
