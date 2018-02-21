import { Injectable } from '@angular/core';

declare const window: any;

@Injectable()

export class GoogleMapService {
    init (initMap: Function) {
        if (typeof initMap === 'function') {
            window.initMap = initMap;
            if (!document.getElementById('google_map_script')) {
                const script = document.createElement('script');
                script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAd5jKOk-1wKMU3IL3sfvd5FAjry7FIwrk&callback=initMap';
                script.async = true;
                script.defer = true;
                script.id = 'google_map_script';
                document.head.appendChild(script);
            } else {
                window.initMap();
            }

        }
    }
}
