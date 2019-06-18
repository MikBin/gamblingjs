export abstract class AbstractDeck {
  ranks: Array<string>;
  suits: Array<string>;
  deck: Array<number>;
  backImages: Array<object>;
  backFaceUrl: object;
  cardsOut: number;
  assetsUri: string;
  constructor(assetsUri: string) {
    this.assetsUri = assetsUri;
    this.cardsOut = 0;
    this.ranks = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "T",
      "J",
      "Q",
      "K",
      "A"
    ];
    this.deck = (new Array(52)).fill(0).map((v, i) => {
      return i;
    });

    this.suits = ['s', 'd', 'h', 'c'];
    this.backImages = this.deck.map((V, I) => {
      return { backgroundImage: `url(${this.assetsUri}${this.ranks[I % 13]}${this.suits[~~(I / 13)]}-min.png)` }
    });
    this.backFaceUrl = {
      backgroundImage: `url(${this.assetsUri}54-min.png)`
    };

    this.backImages.push({
      backgroundImage: `url(${this.assetsUri}54-min.png)`
    })
  }

  abstract cardClick(cardIndex: number): void;

}
