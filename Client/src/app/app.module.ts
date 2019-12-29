import { NgModule} from '@angular/core';
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

    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
