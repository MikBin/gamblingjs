import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FulldeckComponent } from './fulldeck/fulldeck.component';
import { HandAnalyzerComponent } from './hand-analyzer/hand-analyzer.component';
import { TholdemViewComponent } from './tholdem-view/tholdem-view.component';
import { DeuceSevenViewComponent } from './deuce-seven-view/deuce-seven-view.component';
import { RazzComponent } from './razz/razz.component';
import { HilowComponent } from './hilow/hilow.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';

@NgModule({
  declarations: [
    AppComponent,
    FulldeckComponent,
    HandAnalyzerComponent,
    TholdemViewComponent,
    DeuceSevenViewComponent,
    RazzComponent,
    HilowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
