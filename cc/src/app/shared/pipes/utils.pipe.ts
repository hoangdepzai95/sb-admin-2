import { Pipe, PipeTransform } from '@angular/core';
import { numberFormat, percentFormat } from '@src/app/app.utils';
import * as moment from 'moment';

@Pipe({ name: 'numberFormat' })

export class NumberFormatPipe implements PipeTransform {
    transform(value: number) {
        return numberFormat(value);
    }
}

@Pipe({ name: 'percentFormat' })

export class PercentFormatPipe implements PipeTransform {
    transform(value: number) {
        return percentFormat(value);
    }
}

@Pipe({ name: 'dateFormat' })

export class DateFormatPipe implements PipeTransform {
    transform(value: number) {
        const date = moment(value, 'X');
        return date.isValid() ? date.format('DD.MM.YYYY') : null;
    }
}
