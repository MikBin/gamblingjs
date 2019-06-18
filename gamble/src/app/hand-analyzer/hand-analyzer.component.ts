import { Component, OnInit } from '@angular/core';

import { AbstractDeck } from '../AbstractDeck';
import {
  FIVE_CARD_POKER_EVAL, handOfFiveEvalIndexed,
  getHandInfo,
  handOfSixEvalIndexed,
  getPartialHandStatsIndexed_7
} from '../../../../src/gamblingjs'
import { DeckMessageService } from '../pubsub.service'
import { Injectable, Output, Input, EventEmitter } from '@angular/core';
import { handCategoryDistribution } from '../../../../src/interfaces'

console.log(FIVE_CARD_POKER_EVAL);

type dataStats = {
  rankCategory: string;
  rankValue: number;
  avgPotentialRank: number;
  stats: handCategoryDistribution;
};

@Component({
  selector: 'app-hand-analyzer',
  templateUrl: './hand-analyzer.component.html',
  styleUrls: ['./hand-analyzer.component.scss']
})

export class HandAnalyzerComponent extends AbstractDeck implements OnInit {
  hand: Array<number>;
  handWinClasses: Array<string>;
  cardsIn: number;
  dataStats: dataStats;
  @Input() cardPubSub: DeckMessageService;
  constructor() {
    super("assets/imgs/");
    this.dataStats = {
      rankCategory: "",
      rankValue: 0,
      avgPotentialRank: 0,
      stats: {
        'high card': 0,
        'one pair': 0,
        'two pair': 0,
        'three of a kind': 0,
        'straight': 0,
        'flush': 0,
        'full house': 0,
        'four of a kind': 0,
        'straight flush': 0,
        'average': 0
      }
    };
    this.cardsIn = 0;
    this.hand = [
      52,
      52,
      52,
      52,
      52,
      52,
      52
    ];
    this.handWinClasses = [
      "card",
      "card",
      "card",
      "card",
      "card",
      "card",
      "card"
    ];

    this.deck.push(52);
    this.backImages.push({
      backgroundImage: `url(${this.assetsUri}54-min.png)`
    })
  }

  ngOnInit() {
    this.cardPubSub.addCardToHand.subscribe((v) => { this.setCard(v); })
  }

  cardClick(cardIndex: number): void {

    let card = this.hand[cardIndex];
    if (card !== 52) {
      this.hand[cardIndex] = 52;
      this.cardsIn--;
      this.cardPubSub.cardBackToDeck.emit(card);
      this.computeRankingFigures();
    } else return;
  }
  setCard(cardIndex: number): void {
    if (this.cardsIn < 7) {
      let i = this.hand.findIndex(x => x == 52);
      this.hand[i] = cardIndex;
      this.cardsIn++;
      this.computeRankingFigures();
    } else return;
  }
  computeRankingFigures() {

    if (this.cardsIn == 7) {
      let handinfo = FIVE_CARD_POKER_EVAL.HandRankVerbose[7].high(this.hand[0], this.hand[1], this.hand[2], this.hand[3], this.hand[4], this.hand[5], this.hand[6]);
      this.dataStats.rankValue = handinfo.handRank;
      this.dataStats.rankCategory = handinfo.handGroup;
      //handinfo.flushSuit
      this.hand.forEach((h, i) => {
        if (handinfo.winningCards.includes(h)) {
          this.handWinClasses[i] = "card winner";
        }
      });
      setTimeout(() => {
        this.resetWinners();
      }, 2000);
    } else {
      let subHand: Array<number> = this.hand.filter(c => c !== 52);
      let rank: number;
      let hInfo;
      if (subHand.length == 6) {
        rank = handOfSixEvalIndexed(...subHand);
        hInfo = getHandInfo(rank);
      } else if (subHand.length == 5) {
        rank = handOfSixEvalIndexed(...subHand);
        hInfo = getHandInfo(rank);
      }
      if (subHand.length > 4) {
        this.dataStats.rankValue = rank;
        this.dataStats.rankCategory = hInfo.handGroup;
      }

      let stats = getPartialHandStatsIndexed_7(subHand, 1000);
      for (let s in stats) {
        this.dataStats.stats[s] = <number> <unknown>(100 * stats[s]).toFixed(2);
      }
      this.dataStats.avgPotentialRank = ~~stats.average;
    }
  }
  resetWinners() {
    for (let i = 0; i < this.handWinClasses.length; i++)this.handWinClasses[i] = "card";
  }
}
