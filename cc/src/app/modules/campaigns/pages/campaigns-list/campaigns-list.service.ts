import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { cloneDeep } from 'lodash';
import { CampaignsListModel } from '@shared/models/campaigns-list.model';
import { CAMPAIGN_ENDPOINT } from '@src/app/app.constant';
import { getUserSatusText } from '@shared/static-data/user-status.data';
import { DataTableFieldsModels } from '@shared/models/data-table-fields.model';
import { DataTableService } from '@shared/modules/data-table/data-table.service';
import { SelectedRowsTextsModel } from '@shared/models/selected-rows-texts.model';

@Injectable()

export class CampaignsListService {

    constructor(private http: HttpClient, private dataTableService: DataTableService) {
    }

    private parseGetCampaignsResponse = (response: any): CampaignsListModel => {
        let campaigns;
        if (typeof response === 'object') {
            campaigns = {
                isAutoBiddingAllowed: response.isAutoBiddingAllowed,
                canEdit: response.canEdit,
                total: response.total,
                items: []
            };

            if (Array.isArray(response.items)) {
                response.items.forEach((campaign) => {
                    const item = {
                        timeStart: campaign.timeStart,
                        timeEnd: campaign.timeEnd,
                        avgCost: campaign.averageCost || 0,
                        avgCPC: campaign.details.paymentType === 'CPC' ? campaign.averageCost || 0 : null,
                        avgCPM: campaign.details.paymentType === 'CPM' ? campaign.averageCost || 0 : null,
                        ctr: campaign.ctr,
                        spending: campaign.spending,
                        advertCount: campaign.advertCount,
                        clicks: campaign.clicks,
                        shows: campaign.shows,
                        details: cloneDeep(campaign.details),
                        state: cloneDeep(campaign.state),
                        isConformed: campaign.isConformed,
                        id: campaign.campaignId,
                        features: campaign.features,
                        blocked: campaign.blocked
                    };
                    item.details.weeklyBudget = campaign.details.weeklyBudget || null;
                    item.state.status.state = getUserSatusText(campaign.state.status.status);

                    campaigns.items.push(item);
                });

                return campaigns;
            }
        }

        throw new Error('invalid response structure');
    }

    get tableFields(): DataTableFieldsModels {
        return [
            {
                langKey: 'common.Status',
                sortKey: 'state.status',
                thin: true
            },
            {
                langKey: 'common.Campaign',
                sortKey: 'details.name',
                wide: true
            },
            {
                langKey: 'common.Budget (VND/Week)',
                sortKey: 'details.weeklyBudget',
                rightAlign: true
            },
            {
                langKey: 'common.Campaign type',
                sortKey: 'details.type',
                semiwide: true
            },
            {
                langKey: 'campaignsList.Ads',
                sortKey: 'advertCount',
                rightAlign: true
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
                langKey: 'common.Avg.CPM (VND)',
                sortKey: '-details.paymentType,averageCost,averageCPM',
                rightAlign: true
            },
            {
                langKey: 'common.Total cost (VND)',
                sortKey: 'spending',
                rightAlign: true
            },
            {
                langKey: 'campaignsList.Duration',
                sortKey: 'timeStart'
            }
        ];
    }
    get selectedRowsText(): SelectedRowsTextsModel {
        return {
            selectedRows: 'common.campaigns are selected',
            selectedRowsOnPage: 'common.campaigns are selected on this page',
            filtered: 'common.filtered campaigns',
        };
    }

    getCampaigns = (params: HttpParams): Promise<any> => {
        const period = localStorage.getItem('campaign_list_period') || 'total';

        params.set('period', period);

        return this.http.get(CAMPAIGN_ENDPOINT, { params })
            .toPromise()
            .then((res) => {
                return this.parseGetCampaignsResponse(res);
            }).catch((err) => Promise.reject(err));
    }

    updateCampaign = (nextState: any) => {
        this.dataTableService.updateDataTable((campaigns: CampaignsListModel) => {
            campaigns.items.forEach((campaign) => {
                if (campaign.id === nextState.campaign_id) {
                    if (typeof nextState.active_status !== 'undefined') {
                        campaign.state.status.status = nextState.status;
                        campaign.state.status.state = getUserSatusText(nextState.active_status);
                        campaign.state.status.text = nextState.text;
                    }

                    if (typeof nextState.campaign_name !== 'undefined') {
                        campaign.details.name = nextState.campaign_name;
                    }

                    if (typeof nextState.weeklyBudget !== 'undefined') {
                        campaign.details.weeklyBudget = nextState.weeklyBudget || 0;
                    }

                    if (typeof nextState.timeStart !== 'undefined') {
                        campaign.timeStart = nextState.timeStart;
                        campaign.timeEnd = nextState.timeEnd;
                    }
                }
            });
            return campaigns;
        });
    }
}
