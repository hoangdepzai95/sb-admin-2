import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CampaignModel } from '@src/app/shared/models/campaign.model';
import { DataTableService } from '@src/app/shared/modules/data-table/data-table.service';
import { CAMPAIGN_INLINE_EDIT_ENDPOINT } from '@src/app/app.constant';
import { CampaignsListService } from '@src/app/modules/campaigns/pages/campaigns-list/campaigns-list.service';

@Component({
    selector: '[campaigns-list-campaign]',
    templateUrl: './campaign.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class  CampaignComponent {

    @Input()
    campaign: CampaignModel;

    @Input()
    isSelected: boolean;

    editType = '';

    CAMPAIGN_INLINE_EDIT_ENDPOINT = CAMPAIGN_INLINE_EDIT_ENDPOINT;

    constructor(private dataTableService: DataTableService, public campaignsListService: CampaignsListService) {
    }

    selectCampaign() {
        this.dataTableService.toggleSelectRow(this.campaign.id);
    }

    openInlineEdit(type: string) {
        if (this.editType === type && type !== 'duration') {
            this.editType = '';
            return;
        }
        this.editType = type;
    }

    closeInlineEdit() {
        this.editType = '';
    }

}
