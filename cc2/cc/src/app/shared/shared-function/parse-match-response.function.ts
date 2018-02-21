import { getUserSatusText } from '@shared/static-data/user-status.data';
import { cloneDeep } from 'lodash';

export function parseMatchResPonse(response: any) {
    let matchList;
    if (typeof response === 'object') {
        matchList = {
            isAutoBiddingAllowed: response.isAutoBiddingAllowed,
            canEdit: response.canEdit,
            total: response.total,
            items: []
        };

        if (Array.isArray(response.items)) {
            response.items.forEach((match) => {
                const item = {
                    id: match.id,
                    type: match.type,
                    campaignId: match.campaignId,
                    campaignName: match.campaignName,
                    adsGroupId: match.adsGroupId,
                    adsGroupName: match.adsGroupName,
                    limitBid: cloneDeep(match.limitBid),
                    details: cloneDeep(match.details),
                    state: cloneDeep(match.state),
                    stats: cloneDeep(match.stats),
                    blocked: match.blocked
                };

                item.details.user_status_text = getUserSatusText(item.details.user_status);
                matchList.items.push(item);
            });


            return matchList;
        }
    }

    throw new Error(' invalid response structure');
}
