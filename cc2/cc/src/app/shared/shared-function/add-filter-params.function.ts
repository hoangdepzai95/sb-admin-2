import { HttpParams } from '@angular/common/http';
import { FilterHttpParamsModel } from '@shared/models/filter.http-params.model';

export function addFilterParams(params: HttpParams, filter: FilterHttpParamsModel): HttpParams {
    const filters = JSON.parse(params.get('filter'));
    let newParams = new HttpParams();
    for (const key of params.keys()) {
        if (key !== 'filter') {
            newParams = newParams.set(key, params.get(key));
        }
    }
    return newParams.set('filter', JSON.stringify([...filters, filter]));
}
