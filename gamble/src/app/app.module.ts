import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FulldeckComponent } from './fulldeck/fulldeck.component';
import { HandAnalyzerComponent } from './hand-analyzer/hand-analyzer.component';

@NgModule({
  declarations: [
    AppComponent,
    FulldeckComponent,
    HandAnalyzerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
