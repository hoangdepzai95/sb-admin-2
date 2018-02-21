import { DropdownOptionsModel } from '@shared/models/dropdown-options.model';

export const COMPARISON_OPERATORS: DropdownOptionsModel = [
    {
        label: '>',
        value: '>'
    },
    {
        label: '<',
        value: '<'
    }
];

export const COMPARISON_DATE_OPERATORS: DropdownOptionsModel = [
    {
        label: 'common.after',
        value: '>'
    },
    {
        label: 'common.before',
        value: '<'
    }
];
