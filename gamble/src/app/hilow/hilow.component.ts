import { Component, OnInit } from '@angular/core';
import { DeckMessageService } from '../pubsub.service'
import { FIVE_CARD_POKER_EVAL } from '../../../../src/gamblingjs'
@Component({
  selector: 'app-hilow',
  templateUrl: './hilow.component.html',
  styleUrls: ['./hilow.component.scss']
})
export class HilowComponent implements OnInit {

  constructor() { }

  localCardMessages = new DeckMessageService();

  ngOnInit() {

    FIVE_CARD_POKER_EVAL.hashLoaders[7].high();
  }

}
