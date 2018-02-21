export class  CampaignModel {
    advertCount: number;
    id: number;
    avgCPC: number;
    avgCPM: number;
    clicks: number;
    shows: number;
    ctr: number;
    spending: number;
    createdAt: number;
    blocked: boolean;
    details: {
        name: string;
        paymentType: string;
        type: string;
        weeklyBudget: number;
    };
    features: {
        alo: boolean;
        feed: false;
        isConformed: true;
    };
    state: {
        banStatus: boolean;
        status: {
            status: number;
            state: string;
            text: string;
        }
    };
    timeStart: number;
    timeEnd: number;
    userId: number;
    isConformed: boolean;
}

