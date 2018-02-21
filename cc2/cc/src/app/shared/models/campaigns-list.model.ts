import { CampaignModel } from '@shared/models/campaign.model';

export class CampaignsListModel {
    canEdit: boolean;
    isAutoBiddingAllowed: boolean;
    items: Array<CampaignModel>;
    total: number;
}
