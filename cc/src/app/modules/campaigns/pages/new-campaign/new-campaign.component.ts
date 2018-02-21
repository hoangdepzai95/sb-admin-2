import { Component, ChangeDetectionStrategy, ViewChildren, QueryList, ChangeDetectorRef, OnInit } from '@angular/core';
import { NewCampaignService } from '@src/app/modules/campaigns/pages/new-campaign/new-campaign.service';
import { CampaignTypeModel } from '@shared/models/campaign-type.model';
import * as moment from 'moment';
import { TextInputComponent } from '@shared/modules/text-input/text-input.component';
import { NumberInputComponent } from '@shared/modules/number-input/number-input.component';
import { InputInstanceModel } from '@shared/models/input-instance.model';
import { Router } from '@angular/router';
import { BreadcrumbService } from '@src/app/modules/layout/breadcrumb/breadcrumb.service';

declare const toastr: any;

@Component({
    selector: 'create-new-campaign',
    templateUrl: './new-campaign.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class NewCampaignComponent implements OnInit {

    selectedType: CampaignTypeModel;

    enableAlo: boolean;

    campaignName = '';

    duration = { from: moment(), to: null };

    maxBudget: number | string;

    maxImpression = { value: '', unit: 'week' };

    statTracking = true;

    aloShowOnSite: boolean;

    aloShowInAdvert: boolean;

    paymentType: string;

    creatingCampaign: boolean;

    @ViewChildren(TextInputComponent) textInputs: QueryList<TextInputComponent>;

    @ViewChildren(NumberInputComponent) numberInputs: QueryList<NumberInputComponent>;

    constructor(
        public service: NewCampaignService,
        private cdRef: ChangeDetectorRef,
        private router: Router,
        private breadcrumbService: BreadcrumbService
    ) {
    }

    get inputs(): Array<InputInstanceModel> {
        return [...this.textInputs.toArray(), ...this.numberInputs.toArray()];
    }

    get hasErrors(): boolean {
        let error = false;

        this.inputs.forEach((instance: InputInstanceModel) => {
            if (instance.hasErrors) {
                error = true;
            }
        });

        return error;
    }

    ngOnInit() {
        this.breadcrumbService.pushBreadcrumbs({
            id: 'in_adsGroup_context',
            path: 'common.New campaign',
            fullPath: '',
            translate: true
        });
    }

    selectCampaignType(type: CampaignTypeModel) {
        this.selectedType = this.selectedType && type.value === this.selectedType.value ? null : type;
    }

    trackByValue(type: CampaignTypeModel) {
        return type.value;
    }

    onChangeCampaignName(value: string) {
        this.campaignName = value;
    }

    onChangeDuration(field: string, value: moment.Moment) {
        this.duration[field] = value;
    }

    onChangeMaxBudget(value) {
        this.maxBudget = value;
    }

    onChangeMaxImpression(field: string, value) {
        this.maxImpression[field] = value;
    }

    toggleAloShowOnSite(value: boolean) {
        this.aloShowOnSite = value;
    }

    toggleAloShowInAdvert(value: boolean) {
        this.aloShowInAdvert = value;
    }

    onChangePaymentType(type: string) {
        this.paymentType = type;
    }

    onSuccess = () => {
        this.backToCampaignsList();
    }

    async saveCampaign() {
        this.inputs.forEach((instance: InputInstanceModel) => {
            instance.validate();
        });

        if (!this.hasErrors) {
            this.creatingCampaign = true;
            await this.service.createCampaign(this.onSuccess);
            this.creatingCampaign = false;
            this.cdRef.markForCheck();
        } else  {
            toastr.warning('Invalid fields');
        }
    }

    backToCampaignsList() {
        this.router.navigate(['/campaigns/list']);
    }

}
