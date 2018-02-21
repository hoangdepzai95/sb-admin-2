import { AdvertModel } from '@shared/models/advert.model';

export class AdvertListModel {
    canEdit: boolean;
    isAutoBiddingAllowed: boolean;
    items: Array<AdvertModel>;
    total: number;
}
