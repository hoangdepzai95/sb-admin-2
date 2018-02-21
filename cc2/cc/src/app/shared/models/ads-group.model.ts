export class  AdsGroupModel {

    id: number;
    type: number;
    campaignId: number;
    campaignName: string;
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
        name: string;
    };
    state: {
        status: number
    };
    blocked: boolean;
}

