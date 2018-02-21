import { Component, Input } from '@angular/core';
import { AdvertModel } from '@shared/models/advert.model';
import { ADVERT_INLINE_EDIT_ENDPOINT } from '@src/app/app.constant';
import { DataTableService } from '@shared/modules/data-table/data-table.service';
import { AdsListService } from '@src/app/modules/ads/pages/ads-list/ads-list.service';
import { getAdvertType } from '@shared/static-data/advert-type.data';
import { cutLongText } from '@src/app/app.utils';

@Component({
    selector: '[advert]',
    templateUrl: './advert.template.html'
})

export class AdvertComponent {

    @Input()
    advert: AdvertModel;

    @Input()
    isSelected: boolean;

    editType = '';

    getAdvertType = getAdvertType;
    cutLongText = cutLongText;

    ADVERT_INLINE_EDIT_ENDPOINT = ADVERT_INLINE_EDIT_ENDPOINT;

    constructor(public dataTableService: DataTableService, public adsListService: AdsListService) {
    }

    selectAdvert() {
        this.dataTableService.toggleSelectRow(this.advert.id);
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
