export class DataTableColumnModel {
    sortKey: string;
    langKey: string;
    rightAlign?: boolean;
    wide?: boolean;
    semiwide?: boolean;
    thin?: boolean;
    hideInCampaignContext?: boolean;
    hideInAdsGroupContext?: boolean;
}

export type DataTableFieldsModels = DataTableColumnModel[];
