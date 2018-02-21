import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import 'jquery-slimscroll';
import { AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare const jQuery: any;

@Component({
    selector: 'app-navigation',
    templateUrl: 'navigation.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class NavigationComponent implements AfterViewInit {

    window: any = {};

    campaignId: number;
    adsGroupId: number;

    constructor(private router: Router, private route: ActivatedRoute) {
        this.window = window;

        this.route.queryParams.subscribe((params) => {
            this.campaignId = params['campaignId'];
            this.adsGroupId = params['adsGroupId'];
        });
    }

    ngAfterViewInit() {
        jQuery('#side-menu').metisMenu();

        if (jQuery('body').hasClass('fixed-sidebar')) {
            jQuery('.sidebar-collapse').slimscroll({
                height: '100%'
            });
        }
    }

    activeRoute(routename: string): boolean {
        return this.router.url.indexOf(routename) > -1;
    }

    getQueryParam() {
        if (this.campaignId && !this.adsGroupId) {
            return { campaignId: this.campaignId };
        } else if (this.campaignId && this.adsGroupId) {
            return { campaignId: this.campaignId, adsGroupId: this.adsGroupId };
        }
        return {};
    }

}
