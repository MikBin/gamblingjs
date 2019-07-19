import { Component, OnInit } from '@angular/core';

import { DeckMessageService } from '../pubsub.service'
import { FIVE_CARD_POKER_EVAL } from '../../../../src/gamblingjs'
@Component({
  selector: 'app-tholdem-view',
  templateUrl: './tholdem-view.component.html',
  styleUrls: ['./tholdem-view.component.scss']
})
export class TholdemViewComponent implements OnInit {

  constructor() { console.log("holdem constructor"); }

  localCardMessages = new DeckMessageService();

  ngOnInit() {
    /**@TODO do it in main app */
    console.log("holdem oninit");

  }

}
