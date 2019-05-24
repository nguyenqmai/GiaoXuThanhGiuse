import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ExpandableComponent} from './components/expandable/expandable.component';
import {AbcComponent} from './components/abc/abc.component';

import {IonicStorageModule} from '@ionic/storage';
import {Firebase} from '@ionic-native/firebase/ngx';

import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

@NgModule({
    declarations: [AppComponent, ExpandableComponent, AbcComponent,],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        IonicStorageModule.forRoot(),
        LoggerModule.forRoot({level: NgxLoggerLevel.DEBUG, serverLoggingUrl: '', serverLogLevel: NgxLoggerLevel.ERROR})
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        Firebase,

    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
