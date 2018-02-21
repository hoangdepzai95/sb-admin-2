import {Routes} from '@angular/router';

export const ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'campaigns/list',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'campaigns/list'
    }
];
