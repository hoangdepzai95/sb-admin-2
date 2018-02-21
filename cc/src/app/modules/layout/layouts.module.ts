import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BsDropdownModule } from 'ngx-bootstrap';

import { BasicLayoutComponent } from './basic-layout/basic-layout.component';
import { BlankLayoutComponent } from './blank-layout/blank-layout.component';
import { TopNavigationLayoutComponent } from './top-navigation-layout/top-navigation-layout.component';

import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';
import { TopNavbarComponent } from './topnavbar/topnavbar.component';
import { TopNavigationNavbarComponent } from './top-navigation-navbar/top-navigation-navbar.component';
import { BreadcrumbComponent } from '@src/app/modules/layout/breadcrumb/breadcrumb.component';

import { NotificationModule } from '../notification/notification.module';
import { TranslateModule } from '@ngx-translate/core';

import { BreadcrumbService } from '@src/app/modules/layout/breadcrumb/breadcrumb.service';

@NgModule({
    declarations: [
        FooterComponent,
        BasicLayoutComponent,
        BlankLayoutComponent,
        NavigationComponent,
        TopNavigationLayoutComponent,
        TopNavbarComponent,
        TopNavigationNavbarComponent,
        BreadcrumbComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        NotificationModule,
        TranslateModule,
        BsDropdownModule.forRoot()
    ],
    providers: [
    ],
    exports: [
        FooterComponent,
        BasicLayoutComponent,
        BlankLayoutComponent,
        NavigationComponent,
        TopNavigationLayoutComponent,
        TopNavbarComponent,
        TopNavigationNavbarComponent
    ],
})

export class LayoutsModule {
}

