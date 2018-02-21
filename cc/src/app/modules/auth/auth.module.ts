import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BlankLayoutComponent } from '../layout/blank-layout/blank-layout.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'login',
                component: BlankLayoutComponent,
                children: [
                    {
                        path: '',
                        loadChildren: 'app/modules/auth/pages/login/login.module#LoginModule'
                    },
                ]
            },

        ])
    ],
})

export class AuthModule {
}

