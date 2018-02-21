import { CampaignTargetModel } from '@shared/models/campaign-target.model';

export class CampaignTypeModel {
    label: string;
    value: number;
    img: string;
    targets: Array<CampaignTargetModel>;
}
