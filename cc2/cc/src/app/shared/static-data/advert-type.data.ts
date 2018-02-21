import { DropdownOptionsModel } from '@shared/models/dropdown-options.model';

export const ADVERT_TYPE_OPTIONS: DropdownOptionsModel = [
    {
        label: 'common.Search Ads',
        value: 10,
    },
    {
        label: 'common.Search Banner',
        value: 11,
    },
    {
        label: 'common.New Tab Banner',
        value: 21,
    },
    {
        label: 'common.New Tab video',
        value: 23,
    },
    {
        label: 'common.New Tab JS code',
        value: 22,
    },
    {
        label: 'common.Icon Ads',
        value: 40,
    },
    {
        label: 'common.Shopping Ads',
        value: 50,
    },
    {
        label: 'common.Browser Skin Ads',
        value: 24,
    },
    {
        label: 'common.Browser market popup',
        value: 60,
    },
    {
        label: 'common.Preroll',
        value: 70,
    }
];

export function  getAdvertType(type: number): string {
    const adType = ADVERT_TYPE_OPTIONS.find(o => o.value === type);
    return adType ? adType.label : '';
}
