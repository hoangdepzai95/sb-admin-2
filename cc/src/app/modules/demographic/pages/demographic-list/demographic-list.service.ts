import { Injectable } from '@angular/core';
import { MATCH_ENDPOINT } from '@src/app/app.constant';
import { DataTableFieldsModels } from '@shared/models/data-table-fields.model';
import { SelectedRowsTextsModel } from '@shared/models/selected-rows-texts.model';
import { HttpParams } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { parseMatchResPonse } from '@shared/shared-function/parse-match-response.function';
import { addFilterParams } from '@shared/shared-function/add-filter-params.function';

@Injectable()

export class DemographicListService {

    public tableFields: DataTableFieldsModels = [
        {
            langKey: 'common.Status',
            sortKey: 'details.user_status',
            thin: true
        },
        {
            langKey: 'common.Age',
            sortKey: 'details.value',
            wide: true
        },
        {
            langKey: 'common.Campaign',
            sortKey: 'campaign_name',
            hideInCampaignContext: true
        },
        {
            langKey: 'common.Ad group',
            sortKey: 'ads_group_name',
            hideInAdsGroupContext: true
        },
        {
            langKey: 'common.Status',
            sortKey: 'state.status',
            semiwide: true
        },
        {
            langKey: 'campaignsList.Clicks',
            sortKey: 'clicks',
            rightAlign: true
        },
        {
            langKey: 'common.Impressions',
            sortKey: 'shows',
            rightAlign: true
        },
        {
            langKey: 'common.CTR',
            sortKey: 'ctr',
            rightAlign: true
        },
        {
            langKey: 'common.Avg.CPC (VND)',
            sortKey: 'details.paymentType,averageCost,averageCPC',
            rightAlign: true
        },
        {
            langKey: 'common.Total cost (VND)',
            sortKey: 'spending',
            rightAlign: true
        },
    ];

    constructor(private http: HttpClient) {
    }

    get selectedRowsTexts(): SelectedRowsTextsModel {
        return {
            selectedRows: 'common.demographics are selected',
            selectedRowsOnPage: 'common.demographics are selected on this page',
            filtered: 'common.filtered demographics',
        };
    }

    getDemographics = (params: HttpParams) => {
        params = addFilterParams(params, { operator: 'IN', field: 'type', value: ['demographic'] });
        return this.http.get(MATCH_ENDPOINT, { params })
            .toPromise()
            .then((res) => {
                return parseMatchResPonse(res);
            })
            .catch((err) => Promise.reject(err));
    }

    updateDemographic() {

    }

}
