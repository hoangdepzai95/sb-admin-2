import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { DateRangeService } from './date-range.service';
import { AutoUnsubscribe } from '@src/app/app.utils';
import { DataTableService } from '@shared/modules/data-table/data-table.service';

@Component({
    selector: 'campaigns-list-date-range',
    templateUrl: './date-range.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DateRangeService]
})

@AutoUnsubscribe()

export class DateRangeComponent {

    public period: string;

    periodSub: Subscription;

    constructor(public service: DateRangeService, private dataTableService: DataTableService) {
        this.periodSub = this.service.getPeriod().subscribe(value => this.period = value);
    }

    onSelect(item: { value: string, label: string }) {
        this.service.setPeriod(item.value);
        this.dataTableService.getRowsData();
    }
}
