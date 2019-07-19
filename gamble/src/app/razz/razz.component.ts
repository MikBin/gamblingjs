import { Component, OnInit } from '@angular/core';

import { DeckMessageService } from '../pubsub.service'
import { FIVE_CARD_POKER_EVAL } from '../../../../src/gamblingjs'
@Component({
  selector: 'app-razz',
  templateUrl: './razz.component.html',
  styleUrls: ['./razz.component.scss']
})
export class RazzComponent implements OnInit {

  localCardMessages = new DeckMessageService();

  ngOnInit() {

    FIVE_CARD_POKER_EVAL.hashLoaders[7].high();
  }

}
