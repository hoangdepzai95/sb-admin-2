export class MatchModel {
    type: string;
    id: number;
    adsGroupId: number;
    adsGroupName: string;
    campaignId: number;
    campaignName: string;
    limitBid: {
        min: number;
        max: number;
        aloMin: number;
        aloMax: number;
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
        value: number;
        bid: number;
        alo_bid: number;
    };
    state: {
        status: number;
    };
    blocked: boolean;
    canEdit: boolean;
}
