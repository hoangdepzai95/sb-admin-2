/* tslint:disable:max-line-length */

import { Injectable } from '@angular/core';
import { CampaignTargetModel } from '@shared/models/campaign-target.model';
import { CampaignTypeModel } from '@shared/models/campaign-type.model';
import { DropdownOptionsModel } from '@shared/models/dropdown-options.model';
import { once } from 'lodash';
import { HttpClient } from '@angular/common/http';
import { CAMPAIGN_ENDPOINT } from '@src/app/app.constant';
import { ErrorNotifyService } from '@shared/services/error-notify.service';


const KEYWORD = 1;
const RETARGETING = 2;
const GEO_TARGETING = 3;
const AD_SCHEDULING = 4;
const CATEGORY_TARGETING = 5;
const DEMOGRAPHIC = 6;
const COMPETITORS = 7;
const DOMAIN_PATTERN = 8;

declare const toastr;

@Injectable()

export class NewCampaignService {

    private targets: Array<CampaignTargetModel> = [
        {
            label: 'common.Keyword',
            value: KEYWORD,
            description: 'common.When users search for targeted keywords related to your product, your ad will be displayed on the search results page. You will only be charged if a user clicks on your ad.'
        },
        {
            label: 'common.Retargeting',
            value: RETARGETING,
            description: 'common.Your ad will appear on the browser homepage of users who previously visited your websites.'
        },
        {
            label: 'common.Geo-targeting',
            value: GEO_TARGETING,
            description: 'common.Only users in specific cities or locations will see your banner ad. This option is helpful if you only sell your product or service in limited markets.'
        },
        {
            label: 'common.Ad Scheduling',
            value: AD_SCHEDULING,
            description: 'common.Ad scheduling allows you to choose specific dates and times (by hour) when your ad will be displayed. You can use this option if your customers tend to buy more of your product at a specific time of day.'
        },
        {
            label: 'common.Category targeting',
            value: CATEGORY_TARGETING,
            description: 'common.Your banner ad will only be displayed to users who are interested in targeted topics or categories.'
        },
        {
            label: 'common.Demographic',
            value: DEMOGRAPHIC,
            description: 'common.Your banner ad will only be displayed to users who fit targeted age and/or gender demographics.'
        },
        {
            label: 'common.Competitors',
            value: COMPETITORS,
            description: 'common.Your ad will appear on the browser homepage of users who previously visited websites that have similar products to yours.'
        },
        {
            label: 'common.Domain pattern',
            value: DOMAIN_PATTERN,
            description: 'common.Your product and brand will appear to users when they are browsing websites that have similar products to yours. You will only be charged if a user clicks on your ad.'
        }
    ];

    constructor(private http: HttpClient, private errorService: ErrorNotifyService) {
    }

    getTargets(targetValues: Array<number>): Array<CampaignTargetModel> {
        return this.targets.filter(target => targetValues.includes(target.value));
    }

    getCampaignTypeData(): Array<CampaignTypeModel> {
        return [
            {
                label: 'common.Search Ads',
                value: 10,
                img: 'assets/images/ads-type/keyword-ads-thumb.png',
                targets: this.getTargets([KEYWORD, CATEGORY_TARGETING, GEO_TARGETING, AD_SCHEDULING]),
            },
            {
                label: 'common.Search Banner',
                value: 11,
                img: 'assets/images/ads-type/serp-banner-thumb.png',
                targets: this.getTargets([KEYWORD, GEO_TARGETING, AD_SCHEDULING]),
            },
            {
                label: 'common.New Tab Banner',
                value: 21,
                img: 'assets/images/ads-type/media-banner-thumb.png',
                targets: this.getTargets([KEYWORD, CATEGORY_TARGETING, GEO_TARGETING, AD_SCHEDULING, DEMOGRAPHIC, COMPETITORS, RETARGETING]),
            },
            {
                label: 'common.New Tab video',
                value: 23,
                img: 'assets/images/ads-type/newtab-video-thumb.png',
                targets: this.getTargets([KEYWORD, CATEGORY_TARGETING, GEO_TARGETING, AD_SCHEDULING, COMPETITORS, RETARGETING]),
            },
            {
                label: 'common.New Tab JS code',
                value: 22,
                img: 'assets/images/ads-type/newtab-jscode-thumb.png',
                targets: this.getTargets([KEYWORD, GEO_TARGETING, AD_SCHEDULING, COMPETITORS, RETARGETING]),
            },
            {
                label: 'common.Icon Ads',
                value: 40,
                img: 'assets/images/ads-type/newtab-icon-thumb.png',
                targets: this.getTargets([CATEGORY_TARGETING, GEO_TARGETING, AD_SCHEDULING, COMPETITORS, RETARGETING]),
            },
            {
                label: 'common.Shopping Ads',
                value: 50,
                img: 'assets/images/ads-type/shopping-ads-thumb.png',
                targets: this.getTargets([KEYWORD, GEO_TARGETING, AD_SCHEDULING]),
            },
            {
                label: 'common.Browser Skin Ads',
                value: 24,
                img: 'assets/images/ads-type/browser-skin-thumb.png',
                targets: this.getTargets([CATEGORY_TARGETING, GEO_TARGETING, AD_SCHEDULING, DEMOGRAPHIC, COMPETITORS, RETARGETING]),
            },
            {
                label: 'common.Browser market popup',
                value: 60,
                img: 'assets/images/ads-type/market-popup-ads-thumb.png',
                targets: this.getTargets([DOMAIN_PATTERN, GEO_TARGETING, AD_SCHEDULING]),
            },
            {
                label: 'common.Preroll',
                value: 70,
                img: 'assets/images/ads-type/preroll-thumb.png',
                targets: this.getTargets([CATEGORY_TARGETING, COMPETITORS, RETARGETING, GEO_TARGETING, AD_SCHEDULING]),
            }
        ];
    }

    get paymentTypeOptions(): DropdownOptionsModel {
        return [
            {
                label: 'CPC',
                value: 'CPC'
            },
            {
                label: 'CPM',
                value: 'CPM'
            }
        ];
    }

    get maxImpressionUnitOptions(): DropdownOptionsModel {
        return [
            {
                label: 'common.day',
                value: 'day'
            },
            {
                label: 'common.week',
                value: 'week'
            },
            {
                label: 'common.month',
                value: 'month'
            }
        ];
    }

    createCampaign(onSuccess: Function): Promise<any> {

        return this.http.post(CAMPAIGN_ENDPOINT, {})
            .toPromise()
            .then(() => {
                toastr.success('New campaign created');
                onSuccess();
            })
            .catch(() => {
                this.errorService.show();
            });
    }
}
