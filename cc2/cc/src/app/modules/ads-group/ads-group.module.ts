import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BasicLayoutComponent } from '@src/app/modules/layout/basic-layout/basic-layout.component';
import { Routes } from '@angular/router';
import { SharedModule } from '@shared/modules/shared.module';

const routes: Routes = [
    {
        path: 'ads-group',
        component: BasicLayoutComponent,
        children: [
            {
                path: 'list',
                loadChildren: 'app/modules/ads-group/pages/ads-groups-list/ads-groups-list.module#AdsGroupsListModule'
            },
            {
                path: 'new',
                loadChildren: 'app/modules/ads-group/pages/new-ads-group/new-ads-group.module#NewAdsGroupModule'
            },
        ]
    }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})

export class AdsGroupModule {
}
