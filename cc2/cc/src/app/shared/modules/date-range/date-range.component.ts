import {
    Component,
    Input,
    HostListener,
    Output,
    EventEmitter,
    ViewChildren,
    QueryList,
} from '@angular/core';
import * as moment from 'moment';

import { LangService } from '@src/app/lang/lang.service';
import { IMyDpOptions, IMyDate, IMyDateModel, IMyDateRange } from 'mydatepicker';
import { MyDatePicker } from 'mydatepicker';

declare const $: any;

@Component({
    selector: 'date-range',
    templateUrl: './date-range.template.html'
})

export class DateRangeComponent  {

    @Output()
    close =  new EventEmitter<any>();

    @Output()
    fromDateChange = new EventEmitter<any>();

    @Output()
    toDateChange = new EventEmitter<any>();

    @ViewChildren(MyDatePicker) myDatePickers: QueryList<MyDatePicker>;

    @Input()
    fromDate?: moment.Moment = moment();

    @Input()
    toDate: moment.Moment;

    @Input()
    oneLine: boolean;

    public myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd.mm.yyyy',
        editableDateField: false,
        showClearDateBtn: false,
        showTodayBtn: false,
        openSelectorOnInputClick: true,
        disableDateRanges: []
    };

    constructor(
        public langService: LangService,
    ) {
    }

    getIMyDateObject(date: moment.Moment): IMyDate {
        return {
            year: date.year(),
            month: date.month() + 1,
            day: date.date()
        };
    }

    getMomentObject(date: IMyDateModel): moment.Moment {
        return moment(date.epoc, 'X');
    }

    formatDate(date: moment.Moment): string {
        if (!date) {
            return '';
        }
        return date.format('DD.MM.YYYY');
    }

    get fromDateOptions(): IMyDpOptions {
        const disableDateRanges: Array<IMyDateRange> = [{ begin: { year: 1000, month: 1, day: 1 }, end: this.getIMyDateObject(moment())}];
        disableDateRanges[0].end.day = disableDateRanges[0].end.day - 1;
        return {
            ...this.myDatePickerOptions,
            disableDateRanges
        };
    }

    get toDateOptions(): IMyDpOptions {
        return {
            ...this.myDatePickerOptions,
            alignSelectorRight: true,
            disableDateRanges: [{
                begin: { year: 1000, month: 1, day: 1 },
                end: this.getIMyDateObject(this.fromDate)
            }]
        };
    }

    onFromDateChange(e: IMyDateModel) {
        const fromDate = this.getMomentObject(e);
        this.fromDateChange.emit(fromDate);
        if (this.toDate && fromDate.isAfter(this.toDate)) {
            this.myDatePickers.last.selectDate(this.getIMyDateObject(fromDate), null);
            this.toDateChange.emit(fromDate.clone());
        }
    }

    onToDateChange(e: IMyDateModel) {
        this.toDateChange.emit(this.getMomentObject(e));
    }

    fixDatePickerError(component: MyDatePicker) {
        if (component) {
            const $selector = $(component.elem.nativeElement.querySelector('.selector'));
            setTimeout(() => {
                if (!component.showSelector && $selector.length) {
                    $selector.hide();
                }
            });
        }
    }

    @HostListener('document:click', ['$event'])
    onClickOutSide () {
        this.fixDatePickerError(this.myDatePickers.first);
        this.fixDatePickerError(this.myDatePickers.last);
    }
}
