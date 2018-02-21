import { CampaignModel } from '@shared/models/campaign.model';
import { AdsGroupModel } from '@shared/models/ads-group.model';
import { AdvertModel } from '@shared/models/advert.model';
import { MatchModel } from '@shared/models/match.model';

export class DataTableModel {
    canEdit: boolean;
    isAutoBiddingAllowed: boolean;
    items: Array<CampaignModel | AdsGroupModel | AdvertModel | MatchModel>;
    total: number;
}
