import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';

import { ROUTES } from './app.routes';
import { AppComponent } from './app.component';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BaseURLIntercept } from './http/baseURL.interceptor';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemDataService } from '../mocks/in-memory-data.service';
import { AppConfigService } from './app.config.service';
import { LangService } from './lang/lang.service';
import { AuthModule } from '@src/app/modules/auth/auth.module';
import { AdsGroupModule } from '@src/app/modules/ads-group/ads-group.module';
import { AdsModule } from '@src/app/modules/ads/ads.module';
import { KeywordModule } from '@src/app/modules/keyword/keyword.module';
import { DemographicModule } from '@src/app/modules/demographic/demographic.module';
import { PreloadAllModules } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BreadcrumbService } from '@src/app/modules/layout/breadcrumb/breadcrumb.service';
import { ErrorNotifyService } from '@shared/services/error-notify.service';

export function configApp(appConfigService: AppConfigService) {
    return () => appConfigService.load();
}
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        CampaignsModule,
        AuthModule,
        AdsGroupModule,
        AdsModule,
        KeywordModule,
        DemographicModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(ROUTES, { preloadingStrategy: PreloadAllModules }),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
         HttpClientInMemoryWebApiModule.forRoot(InMemDataService, { delay: 500, passThruUnknownUrl: true })
    ],
    providers: [
        LangService,
        AppConfigService,
        BreadcrumbService,
        ErrorNotifyService,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: BaseURLIntercept, multi: true },
        {
            'provide': APP_INITIALIZER,
            'useFactory': configApp,
            'deps': [AppConfigService],
            'multi': true
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
