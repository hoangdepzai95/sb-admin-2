import { Component } from '@angular/core';
import { smoothlyMenu } from '../../../app.helpers';

declare var jQuery: any;

@Component({
    selector: 'app-topnavigationnavbar',
    templateUrl: './top-navigation-navbar.template.html'
})
export class TopNavigationNavbarComponent {

    toggleNavigation(): void {
        jQuery('body').toggleClass('mini-navbar');
        smoothlyMenu();
    }

}
