export class AdvertModel {

    id: number;
    type: number;
    campaignId: number;
    campaignName: string;
    adsGroupId: number;
    adsGroupName: string;
    limitBid: {
        min: number;
        max: number;
        alo_min: number;
        alo_max: number;
    };
    stats: {
        clicks: number;
        shows: number;
        spending: number;
        ctr: number;
        averageCost: number;
        averagePos: number;
    };
    details: {
        user_status: number;
        user_status_text: string;
        title: string;
        description: string;
        url: string;
        image: string;
        alo: Array<any>;
    };
    state: {
        status: number;
    };
    blocked: boolean;
}
