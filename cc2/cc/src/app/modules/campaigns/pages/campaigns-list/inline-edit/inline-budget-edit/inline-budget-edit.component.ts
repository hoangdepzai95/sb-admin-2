import {
    Component,
    Input,
    HostListener,
    Output,
    EventEmitter,
    ElementRef,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';

import { CampaignModel } from '@shared/models/campaign.model';
import { InlineBudgetEditService } from './inline-budget-edit.service';
import { CampaignsListService } from '@src/app/modules/campaigns/pages/campaigns-list/campaigns-list.service';
import { numberFormat, parseLikeNumberString } from '@src/app/app.utils';
import { MAX_WEEK_BUDGET, MIN_WEEK_BUDGET } from '@src/app/modules/campaigns/campaigns.constant';

@Component({
    selector: 'inline-budget-edit',
    templateUrl: './inline-budget-edit.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class InlineBudgetEditComponent implements OnInit {

    @Input()
    campaign: CampaignModel;

    @Output()
    close =  new EventEmitter<any>();

    budget = '';
    errors = { min: false, max: false };
    MAX_WEEK_BUDGET = numberFormat(MAX_WEEK_BUDGET);
    MIN_WEEK_BUDGET = numberFormat(MIN_WEEK_BUDGET);
    loading: boolean;

    constructor(
        private ref: ElementRef,
        public service: InlineBudgetEditService,
        private campaignsListService: CampaignsListService,
        private cdRef: ChangeDetectorRef
    ) {
        this.service.loading.subscribe((value: boolean) => {
            this.loading = value;
            this.cdRef.markForCheck();
        });
    }

    ngOnInit() {
        this.budget = this.campaign.details.weeklyBudget ? numberFormat(this.campaign.details.weeklyBudget) : '';
        this.ref.nativeElement.querySelector('input').focus();
    }

    cancel() {
        this.close.emit();
    }

    onChangeBudget(e) {
        const input = this.ref.nativeElement.querySelector('input');
        const value = parseLikeNumberString(e.target.value);

        if (value !== '') {
            this.budget = input.value = numberFormat(value);

        } else {
            this.budget = input.value = '';
            this.errors.min = false;
            this.errors.max = false;
        }
    }

    validate() {
        const budget = parseLikeNumberString(this.budget);

        if (budget !== '') {
            if (parseInt(budget, 10) < MIN_WEEK_BUDGET) {
                this.errors.min = true;
            } else {
                this.errors.min = false;
            }

            if (parseInt(budget, 10) > MAX_WEEK_BUDGET) {
                this.errors.max = true;
            } else {
                this.errors.max = false;
            }
        } else {
            this.errors.min = false;
            this.errors.max = false;
        }

        return !this.errors.min && !this.errors.max;
    }

    changeBudget() {
        if (this.validate()) {
            const budget = parseLikeNumberString(this.budget);
            this.service.changeBudget(this.campaign.id, parseInt(budget, 10) || '', this.onSuccess.bind(this));
        }
    }

    onSuccess(res: any) {
        this.close.emit();
        this.campaignsListService.updateCampaign(
            {
                id: res.campaign_id,
                weeklyBudget: res.campaign.payment_limit_value,
            }
        );
    }

    @HostListener('document:click', ['$event'])
    onClickOutSide (e) {
        if (!this.ref.nativeElement.parentNode.contains(e.target)) {
            this.close.emit();
        }
    }
}
