import { NgModule } from '@angular/core';
import { LoginComponent } from '@src/app/modules/auth/pages/login/login.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        RouterModule.forChild([
            { path: '', component: LoginComponent }
        ])
    ]
})

export class LoginModule {
}
