import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component'
import { TholdemViewComponent } from './tholdem-view/tholdem-view.component'
import { DeuceSevenViewComponent } from './deuce-seven-view/deuce-seven-view.component'

import { RazzComponent } from './razz/razz.component'
import { HilowComponent } from './hilow/hilow.component'

const routes: Routes = [
  { path: "holdem", component: TholdemViewComponent },
  { path: "27", component: DeuceSevenViewComponent },
  { path: "razz", component: RazzComponent },
  { path: "hilow", component: HilowComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
