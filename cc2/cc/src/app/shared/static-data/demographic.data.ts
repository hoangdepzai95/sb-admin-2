import { DropdownOptionsModel } from '@shared/models/dropdown-options.model';

export const DEMO_GRAPHIC_OPTION: DropdownOptionsModel = [
    {
        label: 'common.Male',
        value: 11190
    },
    {
        label: 'common.Female',
        value: 11191
    },
    {
        label: 'common.Ages 0-14',
        value: 11192
    },
    {
        label: 'common.Ages 15-24',
        value: 11196
    },
    {
        label: 'common.Ages 25-34',
        value: 11197
    },
    {
        label: 'common.Ages 0-24',
        value: 11213
    },
    {
        label: 'common.Ages 15-34',
        value: 11214
    },
    {
        label: 'common.Ages 25-44',
        value: 11215
    },
    {
        label: 'common.Ages 35+',
        value: 11216
    },
    {
        label: 'common.Male 0-14',
        value: 11201
    },
    {
        label: 'common.Male 15-24',
        value: 11202
    },
    {
        label: 'common.Male 25-34',
        value: 11203
    },
    {
        label: 'common.Male 0-24',
        value: 11217
    },
    {
        label: 'common.Male 15-34',
        value: 11218
    },
    {
        label: 'common.Male 25-44',
        value: 11219
    },
    {
        label: 'common.Male 35+',
        value: 11220
    },
    {
        label: 'common.Female 0-14',
        value: 11207
    },
    {
        label: 'common.Female 15-24',
        value: 11208
    },
    {
        label: 'common.Female 25-34',
        value: 11209
    },
    {
        label: 'common.Female 0-24',
        value: 11221
    },
    {
        label: 'common.Female 15-34',
        value: 11222
    },
    {
        label: 'common.Female 25-44',
        value: 11223
    },
    {
        label: 'common.Female 35+',
        value: 11224
    },
    {
        label: 'common.Ages 15-17',
        value: 14120
    },
    {
        label: 'common.Ages 18-24',
        value: 14102
    },
    {
        label: 'common.Ages 35-44',
        value: 11198
    },
    {
        label: 'common.Ages 45-54',
        value: 11199
    },
    {
        label: 'common.Ages 55+',
        value: 11200
    },
    {
        label: 'common.Male 15-17',
        value: 14123
    },
    {
        label: 'common.Male 18-24',
        value: 14105
    },
    {
        label: 'common.Male 35-44',
        value: 11204
    },
    {
        label: 'common.Male 45-54',
        value: 11205
    },
    {
        label: 'common.Male 55+',
        value: 11206
    },
    {
        label: 'common.Female 15-17',
        value: 14126
    },
    {
        label: 'common.Female 18-24',
        value: 14108
    },
    {
        label: 'common.Female 35-44',
        value: 11210
    },
    {
        label: 'common.Female 45-54',
        value: 11211
    },
    {
        label: 'common.Female 55+',
        value: 11212
    }
];

export function getDemographicLabel (value: number): string {
    const demographic = DEMO_GRAPHIC_OPTION.find(item => item.value === value);
    return demographic ? demographic.label : '';
}
