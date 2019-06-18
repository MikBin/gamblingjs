import { Component, OnInit } from '@angular/core';
import { DeckMessageService } from './pubsub.service'
import { FIVE_CARD_POKER_EVAL } from '../../../src/gamblingjs'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'gamble';
  localCardMessages = new DeckMessageService();
  cardFromDeckToHand(ci: number) { }
  cardFromHandToDeck(ci: number) { }

  ngOnInit() {
    FIVE_CARD_POKER_EVAL.hashLoaders[7].high();
  }
}
