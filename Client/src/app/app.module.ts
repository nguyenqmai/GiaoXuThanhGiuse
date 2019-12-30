import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule} from '@angular/platform-browser';
import { RouteReuseStrategy} from '@angular/router';
import { FormsModule} from '@angular/forms';
import { HttpBackend, HttpXhrBackend} from "@angular/common/http";

import { IonicStorageModule} from '@ionic/storage';
import { IonicModule, IonicRouteStrategy, Platform} from '@ionic/angular';

import { SplashScreen} from '@ionic-native/splash-screen/ngx';
import { StatusBar} from '@ionic-native/status-bar/ngx';
import { NativeHttpModule, NativeHttpBackend, NativeHttpFallback } from 'ionic-native-http-connection-backend';


import { Firebase} from '@ionic-native/firebase/ngx';

import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

import { AppRoutingModule} from './app-routing.module';
import { AppComponent} from './app.component';
import { BackendService} from "./services/backend.service";
import { AbcComponent} from './components/abc/abc.component';
import { ExpandableComponent} from './components/expandable/expandable.component';


@NgModule({
    declarations: [AppComponent, ExpandableComponent, AbcComponent,],
    entryComponents: [],
    imports: [
        BrowserModule,
        FormsModule,
        NativeHttpModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        IonicStorageModule.forRoot(),
        LoggerModule.forRoot({level: NgxLoggerLevel.DEBUG, serverLoggingUrl: '', serverLogLevel: NgxLoggerLevel.ERROR}),
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        {provide: HttpBackend, useClass: NativeHttpFallback, deps: [Platform, NativeHttpBackend, HttpXhrBackend]},
        Firebase,
        BackendService,
        {provide: APP_INITIALIZER, useFactory: initApp, deps: [BackendService], multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}


export function initApp(backendService: BackendService) {
    return () => {
        return backendService.pickAvailableUrl().then((resp) => {
            console.log('Response 1 - ', resp);
            backendService.updateUrlPrefix(resp);
        });
    };

}
