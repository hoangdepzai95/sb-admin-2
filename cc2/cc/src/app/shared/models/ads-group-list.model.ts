import { AdsGroupModel } from '@shared/models/ads-group.model';

export class AdsGroupListModel {
    canEdit: boolean;
    isAutoBiddingAllowed: boolean;
    items: Array<AdsGroupModel>;
    total: number;
}
