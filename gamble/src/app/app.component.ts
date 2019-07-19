import { Component, OnInit } from '@angular/core';
import { FIVE_CARD_POKER_EVAL } from '../../../src/gamblingjs'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'gamble';
  constructor() {
    FIVE_CARD_POKER_EVAL.hashLoaders[7].high();
  }

}
