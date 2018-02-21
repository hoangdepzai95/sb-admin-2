import { STATUS } from '@src/app/modules/campaigns/campaigns.constant';
import { DropdownOptionsModel } from '@shared/models/dropdown-options.model';

export const USER_STATUS_OPTIONS: DropdownOptionsModel = [
    {
        value: STATUS.STOPPED,
        label: 'common.Stop',
        iconClass: 'fa fa-circle stopped'
    },
    {
        value: STATUS.ACTIVE,
        label: 'common.Activate',
        iconClass: 'fa fa-circle active'
    },
    {
        value: STATUS.ARCHIVED,
        label: 'common.Archive',
        iconClass: 'fa fa-circle archived'
    }
];

export const FILTER_BY_USER_STATUS_OPTIONS: DropdownOptionsModel = [
    {
        label: 'common.All',
        value: 'all'
    },
    {
        label: 'common.All but archived',
        value: [STATUS.ACTIVE, STATUS.STOPPED],
    },
    {
        label: 'common.Active',
        value: STATUS.ACTIVE,
    },
    {
        label: 'common.Stopped',
        value: STATUS.STOPPED,
    },
    {
        label: 'common.Archived',
        value: STATUS.ARCHIVED,
    }
];

export function getUserSatusText(stateId: number) {
    switch (stateId) {
        case STATUS.STOPPED:
            return 'stopped';
        case STATUS.ACTIVE:
            return 'active';
        case STATUS.ARCHIVED:
            return 'archived';
    }
}
