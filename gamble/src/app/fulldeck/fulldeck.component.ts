import { Component, OnInit } from '@angular/core';
import { DeckMessageService } from '../pubsub.service'
import { AbstractDeck } from '../AbstractDeck';
import { Injectable, Output, Input, EventEmitter } from '@angular/core';
import { FIVE_CARD_POKER_EVAL } from '../../../../src/gamblingjs'
@Component({
  selector: 'app-fulldeck',
  templateUrl: './fulldeck.component.html',
  styleUrls: ['./fulldeck.component.scss']
})
/**@TODO create abstract class to inherit 80%of stuff...add FDS separatedly...or use more paramter in FDS */
export class FulldeckComponent extends AbstractDeck implements OnInit {
  ranks: Array<string>;
  suits: Array<string>;
  deck: Array<number>;
  backImages: Array<object>;
  backFaceUrl: object;
  cardsOut: number;
  assetsUri: string;

  @Input() cardPubSub: DeckMessageService;
  constructor() {
    super("assets/imgs/");

  }
  ngOnInit() {
    this.cardPubSub.cardBackToDeck.subscribe((v) => { this.setCardBack(v); })
  }

  cardClick(cardIndex: number): void {

    if (this.cardsOut == 7) return;
    if (this.deck[cardIndex] !== 52) this.deck[cardIndex] = 52;
    this.cardsOut++;
    this.cardPubSub.addCardToHand.emit(cardIndex);
  }
  setCardBack(cardIndex: number): void {
    if (this.cardsOut == 0) return;
    this.deck[cardIndex] = cardIndex;
    this.cardsOut--;
  }

}
