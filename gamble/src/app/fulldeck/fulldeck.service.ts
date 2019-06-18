
import { Injectable, Output, EventEmitter } from '@angular/core';
@Injectable()
export class FullDeckService {

  @Output() addCardToHand: EventEmitter<number> = new EventEmitter();
  @Output() CardBackToDeck: EventEmitter<number> = new EventEmitter();

}
