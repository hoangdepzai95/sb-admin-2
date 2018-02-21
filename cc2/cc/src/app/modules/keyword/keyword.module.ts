import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BasicLayoutComponent } from '@src/app/modules/layout/basic-layout/basic-layout.component';
import { Routes } from '@angular/router';
import { SharedModule } from '@shared/modules/shared.module';

const routes: Routes = [
    {
        path: 'keyword',
        component: BasicLayoutComponent,
        children: [
            {
                path: 'list',
                loadChildren: 'app/modules/keyword/pages/keyword-list/keyword-list.module#KeywordListModule'
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

export class KeywordModule {
}
