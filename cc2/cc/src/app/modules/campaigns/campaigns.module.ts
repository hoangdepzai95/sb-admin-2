import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Routes } from '@angular/router';

import { BasicLayoutComponent } from '../layout/basic-layout/basic-layout.component';
import { CampaignsListFilterService } from '@src/app/modules/campaigns/pages/campaigns-list/campaigns-list-filter.service';
import { NewCampaignModule } from '@src/app/modules/campaigns/pages/new-campaign/new-campaign.module';

export const routes: Routes = [
    {
        path: 'campaigns',
        component: BasicLayoutComponent,
        children: [
            {
                path: 'list',
                loadChildren: 'app/modules/campaigns/pages/campaigns-list/campaigns-list.module#CampaignsListModule',
            },
            {
                path: 'new',
                loadChildren: 'app/modules/campaigns/pages/new-campaign/new-campaign.module#NewCampaignModule',
            },
        ],
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    providers: [
        CampaignsListFilterService
    ]
})

export class CampaignsModule {
}
