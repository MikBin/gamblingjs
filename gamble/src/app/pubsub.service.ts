
import { Injectable, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable()
export class DeckMessageService {

  @Output() addCardToHand: EventEmitter<number>;
  @Output() cardBackToDeck: EventEmitter<number>;
  constructor() {
    this.addCardToHand = new EventEmitter();
    this.cardBackToDeck = new EventEmitter();
  }
}
