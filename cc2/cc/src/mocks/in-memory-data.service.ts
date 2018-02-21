
import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo, STATUS } from 'angular-in-memory-web-api';
import { cloneDeep, sortBy } from 'lodash';
import * as moment from 'moment';
import { NOTIFICATIONS } from './mocks-data/notifications.mock';
import { CAMPAIGN_LIST } from './mocks-data/campaign-list.mock';
import { ADS_GROUPS } from '@src/mocks/mocks-data/ads-groups.mock';
import { ADVERTS } from '@src/mocks/mocks-data/advert.mock';
import { ADVERT_TYPE_OPTIONS } from '@shared/static-data/advert-type.data';
import { KEYWORDS } from '@src/mocks/mocks-data/keyword.mock';
import { DEMOGRAPHICS } from '@src/mocks/mocks-data/demographic.mock';
import { ALO_LIST } from '@src/mocks/mocks-data/alo-list.mock';
import { REGIONS } from '@src/mocks/mocks-data/region.mock';

@Injectable()

export class InMemDataService implements InMemoryDbService {

    private notifications = NOTIFICATIONS;
    private campaigns = CAMPAIGN_LIST;
    private adsGroups = ADS_GROUPS;
    private advert = ADVERTS;
    private keywords = KEYWORDS;
    private demographic = DEMOGRAPHICS;
    private aloList = ALO_LIST;

    private regions = REGIONS;

    createDb(reqInfo: RequestInfo) {
        return { };

    }
    get(reqInfo: RequestInfo) {
        if (reqInfo.collectionName === 'notifications') {
            return reqInfo.utils.createResponse$(() => {
                return {
                    body: this.notifications,
                    status: STATUS.OK
                };
            });
        }

        if (reqInfo.collectionName === 'campaign' && !reqInfo.id) {
            return this.handleGetCampaigns(reqInfo);
        }

        if (reqInfo.collectionName === 'ads-groups-list') {
            return this.handleGetAdsGroups(reqInfo);
        }

        if (reqInfo.collectionName === 'advert') {
            return this.handleGetAdvert(reqInfo);
        }

        if (reqInfo.collectionName === 'match') {
            return this.handleMatch(reqInfo);
        }

        if (reqInfo.collectionName === 'alo') {
            return this.handleGetAloList(reqInfo);
        }

        if (reqInfo.collectionName === 'region') {
            return this.handleGetRegion(reqInfo);
        }
    }

    post(reqInfo: RequestInfo) {
        if (reqInfo.collectionName === 'notification' && reqInfo.id === 'read') {
            return this.markNotificationAsRead(reqInfo);
        }

        if (reqInfo.collectionName === 'campaign' && reqInfo.id === 'multi_edit_status') {
            return this.multiEditCampaignsStatus(reqInfo);
        }

        if (reqInfo.collectionName === 'ads_group' && reqInfo.id === 'multi_edit_status') {
            return this.multiEditAdsGroupStatus(reqInfo);
        }

        if (reqInfo.collectionName === 'campaign' && reqInfo.id === 'inline_edit') {
            return this.inlineEditCampaign(reqInfo);
        }

        if (reqInfo.collectionName === 'ads_group' && reqInfo.id === 'inline_edit') {
            return this.inlineEditAdsGroup(reqInfo);
        }

        if (reqInfo.collectionName === 'alo') {
            return this.createAloButton(reqInfo);
        }

        if (reqInfo.collectionName === 'campaign') {
            return this.createCampaign(reqInfo);
        }

    }

    markNotificationAsRead(reqInfo: any) {
        return reqInfo.utils.createResponse$(() => {
            const notificationId = reqInfo.req.body.id;
            this.notifications = this.notifications.filter(o => o.id !== notificationId);
            return {
                body: this.notifications,
                status: STATUS.OK,
            };
        });
    }

    getParams(params, key) {
        return (params.find(param => param.param === key) || {}).value;
    }

    filterCampaign(filters, campaigns) {
        for (const filter of filters ) {
            const field = filter.field.split('.')[0];
            const subField = filter.field.split('.')[1];
            let filterValue = filter.value.length > 1 ? filter.value : filter.value[0];

            campaigns.items = campaigns.items.filter((campaign) => {
                let targetValue;
                if (!subField) {
                    targetValue = campaign[field];
                } else {
                    if (subField === 'status') {
                        targetValue = campaign[field][subField].status;
                    } else {
                        targetValue = campaign[field][subField];
                    }
                }
                if (field === 'timeStart' || field === 'timeEnd') {
                    filterValue = moment(filter.value[0], 'YYYY-MM-DD').format('X');
                    if (typeof targetValue === 'undefined') {
                        targetValue = +Infinity;
                    }
                }

                if (filter.operator === 'IN' || filter.operator === 'CONTAIN') {
                    if (subField === 'type') {
                        return `common.${targetValue}` ===
                            (ADVERT_TYPE_OPTIONS.find(option => option.value === filterValue) || { label: ''}).label;
                    }

                    if (subField === 'name') {
                        return targetValue.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1;
                    }

                    if (filter.value.length > 1) {
                        return filterValue.includes(targetValue);
                    } else {
                        return filterValue === targetValue;
                    }
                } else if (filter.operator === '>') {
                    return targetValue > filterValue;
                } else if (filter.operator === '<') {
                    return (targetValue || 0) < filterValue;
                }


            });
        }

        return campaigns;
    }

    handleGetCampaigns(reqInfo) {
        let campaigns = cloneDeep(this.campaigns);

        const params = cloneDeep(reqInfo.req.params.updates);
        // date range : can not detect

        // filter
        const filters = JSON.parse(this.getParams(params, 'filter'));

        campaigns = this.filterCampaign(filters, campaigns);

        // sort
        const offset = +this.getParams(params, 'offset');
        const limit = +this.getParams(params, 'limit');
        const sortKey = this.getParams(params, 'sort');
        let sortOrder;
        let sortField;
        let sortSubField;

        if (sortKey.indexOf('paymentType') !== -1) {
            sortOrder = sortKey.indexOf('-averageCost') ? -1 : 1;
            sortField = 'averageCost';
        } else {
            sortOrder = sortKey.indexOf('-') !== -1 ? -1 : 1;
            sortField = sortKey.split('.')[0].replace('-', '');
            sortSubField = sortKey.split('.')[1];
        }


        campaigns.items = sortBy(campaigns.items, (campaign) => {
            if (!sortSubField) {
                if (sortKey.indexOf('CPC') !== -1 && campaign.details.paymentType !== 'CPC') {
                    return -1;
                }
                if (sortKey.indexOf('CPM') !== -1 && campaign.details.paymentType !== 'CPM') {
                    return -1;
                }
                return campaign[sortField] || 0;
            } else if (sortSubField === 'status') {
                return campaign[sortField][sortSubField].status;
            } else {
                return campaign[sortField][sortSubField] || 0;
            }
        });

        campaigns.items = sortOrder === -1 ? campaigns.items.reverse() : campaigns.items;
        campaigns.total = campaigns.items.length;
        // paging
        campaigns.items = campaigns.items.slice(offset, offset + limit );

        return reqInfo.utils.createResponse$(() => {
            return {
                body: campaigns,
                status: STATUS.OK
            };
        });
    }

    multiEditCampaignsStatus(reqInfo) {
        const req = reqInfo.req.body;
        let filteredCampaigns;

        if (req.where.filter) {
            filteredCampaigns = this.filterCampaign(req.where.filter, cloneDeep(this.campaigns));
        }
        this.campaigns.items.forEach((campaign: any) => {
            const needToChange = req.where.filter ?
                filteredCampaigns.items.find(o => o.campaignId === campaign.campaignId) :
                req.where.id.includes(campaign.campaignId);
            if (needToChange) {
                campaign.state.status.status = req.fields.status;
                campaign.state.status.text = req.fields.status === 0 ? 'Stop' : req.fields.status === 1 ? 'Active' : 'Archvied';
                campaign.blocked = true;
                setTimeout(() => {
                    campaign.blocked = false;
                }, 5000);
            }
        });
        return reqInfo.utils.createResponse$(() => {
            return {
                body: [],
                status: STATUS.OK,
            };
        });
    }

    inlineEditCampaign(reqInfo) {
        const req = reqInfo.req.body;
        req.campaignId = req.id || req.campaignId;

        if (typeof  req.status !== 'undefined') {
            this.campaigns.items.forEach((campaign) => {
                if (req.campaignId === campaign.campaignId) {
                    campaign.state.status.status = req.status;
                    campaign.state.status.text = req.status === 0 ? 'Stop' : req.status === 1 ? 'Active' : 'Archvied';
                }
            });

            const statusText = req.status === 0 ? 'Stopped' : req.status === 1 ? 'Actived' : 'Archvied';
            return reqInfo.utils.createResponse$(() => {
                return {
                    body: {
                        active_status: req.status,
                        campaign_id: req.id,
                        is_changed_status: true,
                        is_expired: false,
                        reload_page: true,
                        status_text: statusText,
                        success_msg: `Campaign ${statusText}`,
                        updated: true
                    },
                    status: STATUS.OK,
                };
            });
        }

        if (typeof  req.name !== 'undefined') {
            this.campaigns.items.forEach((campaign) => {
                if (req.campaignId === campaign.campaignId) {
                    campaign.details.name = req.name;
                }
            });

            return reqInfo.utils.createResponse$(() => {
                return {
                    body: {
                        success_msg: 'Campaign edited',
                        campaign_name: req.name,
                        campaign_id: req.campaignId
                    },
                    status: STATUS.OK,
                };
            });
        }

        if (typeof  req.spendings_limit !== 'undefined') {
            this.campaigns.items.forEach((campaign) => {
                if (req.campaignId === campaign.campaignId) {
                    campaign.details.weeklyBudget = req.spendings_limit;
                }
            });

            return reqInfo.utils.createResponse$(() => {
                return {
                    body: {
                        success_msg: 'Campaign edited',
                        campaign: { payment_limit_value: req.spendings_limit },
                        campaign_id: req.campaignId
                    },
                    status: STATUS.OK,
                };
            });
        }

        if (typeof  req.start_date !== 'undefined') {
            this.campaigns.items.forEach((campaign: any) => {
                if (req.campaignId === campaign.campaignId) {
                    campaign.timeStart = +moment(req.start_date, 'YYYY-MM-DD').format('X');
                    campaign.timeEnd = req.end_date ? +moment(req.end_date, 'YYYY-MM-DD').format('X') : null;
                }
            });

            return reqInfo.utils.createResponse$(() => {
                return {
                    body: {
                        success_msg: 'Campaign edited',
                        campaign: {
                            time_start: moment(req.start_date, 'YYYY-MM-DD').format('YYYY-MM-DD hh:mm:ss'),
                            time_end: req.end_date ? moment(req.end_date, 'YYYY-MM-DD').format('YYYY-MM-DD hh:mm:ss') : null
                        },
                        campaign_id: req.id
                    },
                    status: STATUS.OK,
                };
            });
        }

    }


    handleGetAdsGroups(reqInfo) {
        const params = cloneDeep(reqInfo.req.params.updates);
        const campaignId = +this.getParams(params, 'campaign_id');
        const adsGroups = cloneDeep(this.adsGroups);
        if (campaignId) {
            adsGroups.items = adsGroups.items;
            adsGroups.total = adsGroups.items.length;
        }
        return reqInfo.utils.createResponse$(() => {
            return {
                body: adsGroups,
                status: STATUS.OK,
            };
        });
    }

    inlineEditAdsGroup(reqInfo) {
        const req = reqInfo.req.body;

        if (typeof  req.status !== 'undefined') {
            return reqInfo.utils.createResponse$(() => {
                return {
                    body: {
                        active_status: req.status,
                        id: req.id,
                        is_changed_status: true,
                        is_expired: false,
                        reload_page: true,
                        success_msg: `Ads group edited`,
                        updated: true
                    },
                    status: STATUS.OK,
                };
            });
        }

        if (typeof  req.name !== 'undefined') {

            return reqInfo.utils.createResponse$(() => {
                return {
                    body: {
                        success_msg: 'Ads group edited',
                        name: req.name,
                        id: req.id
                    },
                    status: STATUS.OK,
                };
            });
        }
    }

    multiEditAdsGroupStatus(reqInfo) {
        return reqInfo.utils.createResponse$(() => {
            return {
                body: [],
                status: STATUS.OK,
            };
        });
    }

    handleGetAdvert(reqInfo) {
        return reqInfo.utils.createResponse$(() => {
            return {
                body: this.advert,
                status: STATUS.OK,
            };
        });
    }

    handleMatch(reqInfo) {
        const params = cloneDeep(reqInfo.req.params.updates);
        const filters = JSON.parse(this.getParams(params, 'filter'));

        if (filters.find(filter => filter.field === 'type' && filter.value[0] === 'keyword')) {
            return reqInfo.utils.createResponse$(() => {
                return {
                    body: this.keywords,
                    status: STATUS.OK,
                };
            });
        }

        if (filters.find(filter => filter.field === 'type' && filter.value[0] === 'demographic')) {
            return reqInfo.utils.createResponse$(() => {
                return {
                    body: this.demographic,
                    status: STATUS.OK,
                };
            });
        }

    }

    handleGetAloList(reqInfo) {
        return reqInfo.utils.createResponse$(() => {
            return {
                body: this.aloList,
                status: STATUS.OK,
            };
        });
    }

    createAloButton(reqInfo) {
        return reqInfo.utils.createResponse$(() => {
            return {
                body: {},
                status: STATUS.OK,
            };
        });
    }

    createCampaign(reqInfo) {
        return reqInfo.utils.createResponse$(() => {
            return {
                body: {},
                status: STATUS.OK,
            };
        });
    }

    handleGetRegion(reqInfo) {
        return reqInfo.utils.createResponse$(() => {
            return {
                body: this.regions,
                status: STATUS.OK,
            };
        });
    }
}


