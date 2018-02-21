import { MatchModel } from '@shared/models/match.model';

export class MatchListModel {
    canEdit: boolean;
    isAutoBiddingAllowed: boolean;
    items: Array<MatchModel>;
    total: number;
}
