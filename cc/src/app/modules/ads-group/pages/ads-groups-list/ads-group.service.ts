import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ADS_GROUPS_ENDPOINT } from '@src/app/app.constant';
import { AdsGroupListModel } from '@shared/models/ads-group-list.model';
import { cloneDeep } from 'lodash';
import { getUserSatusText } from '@shared/static-data/user-status.data';
import { SelectedRowsTextsModel } from '@shared/models/selected-rows-texts.model';
import { DataTableService } from '@shared/modules/data-table/data-table.service';
import { DataTableFieldsModels } from '@shared/models/data-table-fields.model';

@Injectable()

export class AdsGroupService {

    public tableFields: DataTableFieldsModels = [
        {
            langKey: 'common.Status',
            sortKey: 'details.user_status',
            thin: true
        },
        {
            langKey: 'common.Ad group',
            sortKey: 'details.name',
            wide: true
        },
        {
            langKey: 'common.Campaign',
            sortKey: 'campaign_name',
            hideInCampaignContext: true
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

    constructor(
        private http: HttpClient,
        private dataTableService: DataTableService,
    ) {
    }

    get selectedRowsTexts(): SelectedRowsTextsModel {
        return {
            selectedRows: 'common.ad groups are selected',
            selectedRowsOnPage: 'common.ad groups are selected on this page',
            filtered: 'common.filtered ad groups',
        };
    }

    private parseGetAdsGroupsResponse = (response: any): AdsGroupListModel => {
        let adsGroupsList;
        if (typeof response === 'object') {
            adsGroupsList = {
                isAutoBiddingAllowed: response.isAutoBiddingAllowed,
                canEdit: response.canEdit,
                total: response.total,
                items: []
            };

            if (Array.isArray(response.items)) {
                response.items.forEach((adsGroup) => {
                    const item = {
                        id: adsGroup.id,
                        details: cloneDeep(adsGroup.details),
                        state: cloneDeep(adsGroup.state),
                        campaignId: adsGroup.campaign_id,
                        campaignName: adsGroup.campaign_name,
                        limitBid: cloneDeep(adsGroup.limit_bid),
                        stats: cloneDeep(adsGroup.stats),
                        blocked: adsGroup.blocked
                    };

                    item.details.user_status_text = getUserSatusText(item.details.user_status);
                    adsGroupsList.items.push(item);
                });

                return adsGroupsList;
            }
        }

        throw new Error(' invalid response structure');
    }

    getAdsGroups = (params: HttpParams): Promise<any> => {

        return this.http.get(ADS_GROUPS_ENDPOINT, { params })
            .toPromise()
            .then((res) => {
                return this.parseGetAdsGroupsResponse(res);
            }).catch((err) => Promise.reject(err));
    }

    updateAdsGroup = (nextState: any) => {
        this.dataTableService.updateDataTable((adsGroups: AdsGroupListModel) => {
            adsGroups.items.forEach((adsGroup) => {
                if (adsGroup.id === nextState.id) {
                    if (typeof nextState.status !== 'undefined') {
                        adsGroup.details.user_status = nextState.status;
                        adsGroup.details.user_status_text = getUserSatusText(nextState.status);
                    }

                    if (typeof nextState.name !== 'undefined') {
                        adsGroup.details.name = nextState.name;
                    }
                }
            });
            return adsGroups;
        });
    }

}
