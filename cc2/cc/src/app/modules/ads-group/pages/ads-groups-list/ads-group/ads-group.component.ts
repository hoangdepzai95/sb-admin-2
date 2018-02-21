import { Component, Input } from '@angular/core';
import { DataTableService } from '@src/app/shared/modules/data-table/data-table.service';
import { AdsGroupModel } from '@src/app/shared/models/ads-group.model';
import { ADS_GROUP_INLINE_EDIT_ENDPOINT } from '@src/app/app.constant';
import { AdsGroupService } from '@src/app/modules/ads-group/pages/ads-groups-list/ads-group.service';

@Component({
    selector: '[ads-group-list-ads-group]',
    templateUrl: 'ads-group.template.html'
})

export class AdsGroupComponent {


    @Input()
    adsGroup: AdsGroupModel;

    @Input()
    isSelected: boolean;

    editType = '';

    ADS_GROUP_INLINE_EDIT_ENDPOINT = ADS_GROUP_INLINE_EDIT_ENDPOINT;

    constructor(public dataTableService: DataTableService, public adsGroupService: AdsGroupService) {
    }

    selectAdsGroup() {
        this.dataTableService.toggleSelectRow(this.adsGroup.id);
    }

    openInlineEdit(type: string) {
        if (this.editType === type) {
            this.editType = '';
            return;
        }
        this.editType = type;
    }

    closeInlineEdit() {
        this.editType = '';
    }

}
