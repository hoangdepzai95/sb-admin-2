import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ADVERT_ENDPOINT } from '@src/app/app.constant';
import { AdsGroupListModel } from '@shared/models/ads-group-list.model';
import { getUserSatusText } from '@shared/static-data/user-status.data';
import { cloneDeep } from 'lodash';
import { SelectedRowsTextsModel } from '@shared/models/selected-rows-texts.model';
import { DataTableFieldsModels } from '@shared/models/data-table-fields.model';

@Injectable()

export class AdsListService {

    public tableFields: DataTableFieldsModels = [
        {
            langKey: 'common.Status',
            sortKey: 'details.user_status',
            thin: true
        },
        {
          langKey: 'common.Ad',
          sortKey: 'details.title',
          wide: true,
        },
        {
            langKey: 'common.Ad group',
            sortKey: 'ads_group_name',
            wide: true,
            hideInAdsGroupContext: true
        },
        {
            langKey: 'common.Campaign',
            sortKey: 'campaign_name',
            hideInCampaignContext: true
        },
        {
            langKey: 'common.Ad type',
            sortKey: 'type',
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

    parseGetAdsResponse(response: any): AdsGroupListModel {
            let advertList;
            if (typeof response === 'object') {
                advertList = {
                    isAutoBiddingAllowed: response.isAutoBiddingAllowed,
                    canEdit: response.canEdit,
                    total: response.total,
                    items: []
                };

                if (Array.isArray(response.items)) {
                    response.items.forEach((advert) => {
                        const item = {
                            id: advert.id,
                            type: advert.type,
                            campaignId: advert.campaign_id,
                            campaignName: advert.campaign_name,
                            adsGroupId: advert.ads_group_id,
                            adsGroupName: advert.ads_group_name,
                            limitBid: cloneDeep(advert.limit_bid),
                            details: cloneDeep(advert.details),
                            state: cloneDeep(advert.state),
                            stats: cloneDeep(advert.stats),
                            blocked: advert.blocked
                        };

                        item.details.user_status_text = getUserSatusText(item.details.user_status);
                        advertList.items.push(item);
                    });


                    return advertList;
                }
            }

            throw new Error(' invalid response structure');
    }

    get selectedRowsTexts(): SelectedRowsTextsModel {
        return {
            selectedRows: 'common.ads are selected',
            selectedRowsOnPage: 'common.ads are selected on this page',
            filtered: 'common.filtered ads',
        };
    }

    getAds = (params: HttpParams) => {

        return this.http.get(ADVERT_ENDPOINT, { params })
            .toPromise()
            .then((res) => {
                return this.parseGetAdsResponse(res);
            })
            .catch((err) => Promise.reject(err));
    }

    updateAdvert = () => {

    }
}
