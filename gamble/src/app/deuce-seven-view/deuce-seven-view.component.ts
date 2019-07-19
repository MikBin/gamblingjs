import { Component, OnInit } from '@angular/core';

import { DeckMessageService } from '../pubsub.service'
import { FIVE_CARD_POKER_EVAL } from '../../../../src/gamblingjs'
@Component({
  selector: 'app-deuce-seven-view',
  templateUrl: './deuce-seven-view.component.html',
  styleUrls: ['./deuce-seven-view.component.scss']
})
export class DeuceSevenViewComponent implements OnInit {

  constructor() { }

  localCardMessages = new DeckMessageService();

  ngOnInit() {
    console.log("init 27");
    //FIVE_CARD_POKER_EVAL.hashLoaders[7].high();
  }

}
