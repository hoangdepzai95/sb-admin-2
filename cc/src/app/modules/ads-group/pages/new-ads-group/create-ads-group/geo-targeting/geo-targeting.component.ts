import { Component, OnInit } from '@angular/core';
import { GoogleMapService } from '@shared/services/google-map.service';
import { CreateAdsGroupService } from '@src/app/modules/ads-group/pages/new-ads-group/create-ads-group/create-ads-group.service';
import { debounce } from 'lodash';
import { DropDownItemModel } from '@shared/models/dropdown-options.model';

declare const window: any;
declare const google: any;

@Component({
    selector: 'geo-targeting',
    templateUrl: './geo-targeting.template.html'
})

export class GeoTargetingComponent implements OnInit {

    map: any;

    constructor(private googleMapService: GoogleMapService, public service: CreateAdsGroupService) {
         this.searchRegion = debounce(this.searchRegion, 300);
    }

    ngOnInit() {

        this.googleMapService.init(() => {
            const vietnamCenter = new google.maps.LatLng(16.0667, 108.2333);

            this.map = new google.maps.Map(document.getElementById('google_map'), {
                scrollwheel: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoom: 5,
                panControl: true,
                panControlOptions: {
                    position: google.maps.ControlPosition.TOP_RIGHT
                },
                zoomControl: true,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.LARGE,
                    position: google.maps.ControlPosition.TOP_RIGHT
                },
                minZoom: 5,
                maxZoom: 19,
                center: vietnamCenter,
                streetViewControl: false,
                gestureHandling: 'greedy'
            });
        });
    }

    searchRegion(keyword: string) {
        if (keyword.trim()) {
            this.service.searchRegion(keyword);
        } else  {
            this.service.clearRegions();
        }
    }

    selectRegion(item: DropDownItemModel) {

        const position = new google.maps.LatLng(21.028511, 105.804817);
        this.drawMarker(position);
    }

    drawMarker(position) {
        const marker = new google.maps.Marker({
            map: this.map,
            position: position,
            icon: {
                path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
                fillColor: '#18a689',
                fillOpacity: 0.9,
                strokeColor: '#12735f',
                strokeWeight: 2,
                scale: 1
            },
        });

        const circle = new google.maps.Circle({
            map: this.map,
            radius: 10000,    // metres
            fillColor: '#18a689',
            strokeColor: '#18a689',
            fillOpacity: 0.2,
            strokeOpacity: 0.7,
            strokeWeight: 0.5
        });
        circle.bindTo('center', marker, 'position');
    }
}
