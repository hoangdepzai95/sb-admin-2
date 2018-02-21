import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SEARCH_REGION_ENDPOINT } from '@src/app/app.constant';
import { ErrorNotifyService } from '@shared/services/error-notify.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { RegionModel } from '@shared/models/region.model';
import { DropdownOptionsModel } from '@shared/models/dropdown-options.model';

@Injectable()

export class CreateAdsGroupService {

    private searchingRegion = new BehaviorSubject<boolean>(false);

    private regions = new BehaviorSubject<RegionModel[]>([]);

    constructor(private http: HttpClient, private errorService: ErrorNotifyService) {
    }

    getSearchingRegion(): Observable<boolean> {
        return this.searchingRegion.asObservable();
    }

    getRegions(): Observable<RegionModel[]> {
        return this.regions.asObservable();
    }

    parseRegionsResponse(res: any) {
        if (Array.isArray(res)) {
            this.regions.next(res);
        } else {
            throw new Error('invalid response');
        }
    }

    getRegionsOptions(regions: RegionModel[]): DropdownOptionsModel {
        const result = [];
        regions.forEach((province) => {
            result.push({
                label: province.name,
                value: province.name,
                latLon: province.latLon,
                iconClass: 'fa fa-map-marker',
                radius: province.radius
            });
            province.district.forEach((district) => {
                result.push({
                    label: district.name,
                    value: district.name,
                    latLon: district.latLon,
                    iconClass: 'fa fa-map-marker',
                    radius: district.radius
                });
            });
        });
        return result;
    }

    clearRegions() {
        this.regions.next([]);
    }

    searchRegion(keyword: string) {

        const params = new HttpParams()
            .set('keyword', keyword);

        this.searchingRegion.next(true);
        this.http.get(SEARCH_REGION_ENDPOINT, { params })
            .toPromise()
            .then((res) => {
                this.searchingRegion.next(false);
                this.parseRegionsResponse(res);

            }).catch(() => {
                this.errorService.show();
                this.searchingRegion.next(false);
        });
    }

}
