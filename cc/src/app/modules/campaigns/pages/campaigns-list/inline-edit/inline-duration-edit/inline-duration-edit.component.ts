import {
    Component,
    Input,
    HostListener,
    Output,
    EventEmitter,
    ElementRef,
    OnInit,
    ViewChildren,
    QueryList,
    ChangeDetectorRef
} from '@angular/core';
import * as moment from 'moment';

import { CampaignModel } from '@shared/models/campaign.model';
import { InlineDurationEditService } from './inline-duration-edit.service';
import { CampaignsListService } from '@src/app/modules/campaigns/pages/campaigns-list/campaigns-list.service';
import { LangService } from '@src/app/lang/lang.service';
import { MyDatePicker } from 'mydatepicker';

declare const $: any;

@Component({
    selector: 'inline-duration-edit',
    templateUrl: './inline-duration-edit.template.html'
})

export class InlineDurationEditComponent implements OnInit {

    @Input()
    campaign: CampaignModel;

    @Output()
    close =  new EventEmitter<any>();

    @ViewChildren(MyDatePicker) myDatePickers: QueryList<MyDatePicker>;

    fromDate?: moment.Moment = moment();
    toDate: moment.Moment;

    loading: boolean;

    constructor(
        private ref: ElementRef,
        public service: InlineDurationEditService,
        private campaignsListService: CampaignsListService,
        public langService: LangService,
        private cdRef: ChangeDetectorRef
    ) {
        this.service.loading.subscribe((value: boolean) => {
            this.loading = value;
            this.cdRef.markForCheck();
        });
    }

    ngOnInit() {
        this.fromDate = moment(this.campaign.timeStart, 'X');
        this.toDate = this.campaign.timeEnd ? moment(this.campaign.timeEnd, 'X') : null;
    }

    formatDate(date: moment.Moment): string {
        if (!date) {
            return '';
        }
        return date.format('DD.MM.YYYY');
    }


    onFromDateChange(e: moment.Moment) {
        this.fromDate = e;
    }

    onToDateChange(e: moment.Moment) {
        this.toDate = e;
    }

    cancel() {
        this.close.emit();
    }

    onSuccess(timeStart: number, timeEnd: number, campaignId: number) {

        this.close.emit();
        this.campaignsListService.updateCampaign({
            timeStart,
            timeEnd,
            id: campaignId
        });
    }

    editDuration() {
        const startDate = this.fromDate.format('YYYY-MM-DD');
        const endDate = this.toDate ? this.toDate.format('YYYY-MM-DD') : '';
        this.service.editDuration(startDate, endDate, this.campaign.id, this.onSuccess.bind(this));
    }

    @HostListener('document:click', ['$event'])
    onClickOutSide (e) {
        if (!this.ref.nativeElement.parentNode.contains(e.target)) {
            this.close.emit();
        }
    }
}
