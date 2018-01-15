"use strict";

import cfg from '../../config.json';
import analytics from '../analytics';
import out from '../out';
import arr from '../util/arr';
import tradestore from '../tradestore';

export default class BuyLowSellHigh {

  constructor() {

    this.trader = null;
    this.mainBalance = 0;
    this.currentValue = 0;
    this.data = [];
    this.changes = [];
    this.evaluated = [];
    this.hasTrade = false;
  }

  assertProfit(buyValue, sellValue) {

    let diff = sellValue - buyValue;
    if (diff < 0) {
      return false;
    }
    return (this.getProfitPercentage(buyValue, sellValue) > cfg.minProfitPercentage);
  }

  getProfitPercentage(buyValue, sellValue) {

    let diff = sellValue - buyValue;
    return (diff/buyValue)*100;
  }

  buy() {

    let quantity = Math.floor(cfg.maxTrade / this.currentValueSatoshi);
    this.trader.buy(quantity);
    tradestore.addTrade(this.trader.symbol, this.currentValueSatoshi, quantity);
  }

  sell() {

    let quantity = tradestore.getTrade(this.trader.symbol).quantity;

    console.log(this.currentValueSatoshi);
    this.trader.sell(quantity);
    tradestore.removeTrade(this.trader.symbol);
  }

  evaluate() {

    let lastBuy = tradestore.getTrade(this.trader.symbol);
    this.hasTrade = Boolean(lastBuy);

    let lastCandlestick = this.data[this.data.length-1];
    this.currentValue = analytics.getCurrentValue(this.data);
    this.currentValueSatoshi = analytics.toSatoshi(this.currentValue);

    this.changes = analytics.valueChanges(this.data);

    if (!this.hasTrade) {

      out.log('Looking to buy');

      if (!arr.contains(this.evaluated, lastCandlestick[0])) {

        out.changeBlock(this.changes);

        let normalized = analytics.normalize(this.data);

        // belt holds
        analytics.findPatternBeltHold(normalized)
          .then(result => {
            if (analytics.isBullishBeltHold(result, this.changes)) {
              console.log('Bullish belt hold detected');
              this.buy();
            }
          })
        ;

        // hammers
        analytics.findPatternHammer(normalized)
          .then(result => {
            if (analytics.isBullishHammer(result, this.changes)) {
              console.log('Bullish hammer detected');
              this.buy();
            }
          })
        ;

        // inverted hammers
        analytics.findPatternInvertedHammer(normalized)
          .then(result => {
            if (analytics.isBullishInvertedHammer(result, this.changes)) {
              console.log('Bullish inverted hammer detected');
              this.buy();
            }
          })
        ;

        // harami
        analytics.findPatternHarami(normalized)
          .then(result => {
            if (analytics.isBullishHarami(result, this.changes)) {
              console.log('Bullish harami detected');
              this.buy();
            }
          })
        ;

        // harami cross
        analytics.findPatternHaramiCross(normalized)
          .then(result => {
            if (analytics.isBullishHaramiCross(result, this.changes)) {
              console.log('Bullish harami cross detected');
              this.buy();
            }
          })
        ;

        // abandoned baby
        analytics.findPatternAbandonedBaby(normalized)
          .then(result => {
            if (analytics.isBullishAbandonedBaby(result, this.changes)) {
              console.log('Bullish abandoned baby detected');
              this.buy();
            }
          })
        ;

        // kicking
        analytics.findPatternKicking(normalized)
          .then(result => {
            if (analytics.isBullishKicking(result, this.changes)) {
              console.log('Bullish kicking detected');
              this.buy();
            }
          })
        ;

        // morning star
        analytics.findPatternKicking(normalized)
          .then(result => {
            if (analytics.isBullishMorningStar(result, this.changes)) {
              console.log('Bullish morning star detected');
              this.buy();
            }
          })
        ;

        // doji star
        analytics.findPatternDojiStar(normalized)
          .then(result => {
            if (analytics.isBullishDojiStar(result, this.changes)) {
              console.log('Bullish doji star detected');
              this.buy();
            }
          })
        ;

        // three white soldiers
        analytics.findPatternThreeWhiteSoldiers(normalized)
          .then(result => {
            if (analytics.isBullishThreeWhiteSoldiers(result, this.changes)) {
              console.log('Bullish three white soldiers detected');
              this.buy();
            }
          })
        ;

        // engulfing
        analytics.findPatternEngulfing(normalized)
          .then(result => {
            if (analytics.isBullishEngulfing(result, this.changes)) {
              console.log('Bullish engulfing detected');
              this.buy();
            }
          })
        ;

        // engulfing
        analytics.findPatternThreeStarsInTheSouth(normalized)
          .then(result => {
            if (analytics.isBullishThreeStarsInTheSouth(result, this.changes)) {
              console.log('Bullish three stars in the south detected');
              this.buy();
            }
          })
        ;

        this.evaluated.push(lastCandlestick[0]);
      }

    } else if (this.hasTrade) {

      out.log('Looking to sell '+lastBuy.price);

      if( this.assertProfit(lastBuy.price, this.currentValueSatoshi) ) {

        out.log('Current trade profit: '+this.getProfitPercentage(lastBuy.price, this.currentValueSatoshi)+'%');

        if (this.getProfitPercentage(lastBuy.price, this.currentValueSatoshi) > cfg.instantSellPercentage) {

          out.log('Instant sell percentage hit');
          this.sell();

        } else {

          if (!arr.contains(this.evaluated, lastCandlestick[0])) {

            out.changeBlock(this.changes);

            let normalized = analytics.normalize(this.data);

            // belt holds
            analytics.findPatternBeltHold(normalized)
              .then(result => {
                if (analytics.isBearishBeltHold(result, this.changes)) {
                  console.log('Bearish belt hold detected');
                  this.sell();
                }
              })
            ;

            // hammers
            analytics.findPatternHammer(normalized)
              .then(result => {
                if (analytics.isBearishHammer(result, this.changes)) {
                  console.log('Bearish hammer detected');
                  this.sell();
                }
              })
            ;

            // inverted hammers
            analytics.findPatternInvertedHammer(normalized)
              .then(result => {
                if (analytics.isBearishInvertedHammer(result, this.changes)) {
                  console.log('Bearish inverted hammer detected');
                  this.sell();
                }
              })
            ;

            // harami
            analytics.findPatternHarami(normalized)
              .then(result => {
                if (analytics.isBearishHarami(result, this.changes)) {
                  console.log('Bearish harami detected');
                  this.sell();
                }
              })
            ;

            // harami cross
            analytics.findPatternHaramiCross(normalized)
              .then(result => {
                if (analytics.isBearishHaramiCross(result, this.changes)) {
                  console.log('Bearish harami cross detected');
                  this.buy();
                }
              })
            ;

            // abandoned baby
            analytics.findPatternAbandonedBaby(normalized)
              .then(result => {
                if (analytics.isBearishAbandonedBaby(result, this.changes)) {
                  console.log('Bearish abandoned baby detected');
                  this.sell();
                }
              })
            ;

            // kicking
            analytics.findPatternKicking(normalized)
              .then(result => {
                if (analytics.isBearishKicking(result, this.changes)) {
                  console.log('Bearish kicking detected');
                  this.sell();
                }
              })
            ;

            // morning star
            analytics.findPatternKicking(normalized)
              .then(result => {
                if (analytics.isBearishMorningStar(result, this.changes)) {
                  console.log('Bearish morning star detected');
                  this.sell();
                }
              })
            ;

            // doji star
            analytics.findPatternDojiStar(normalized)
              .then(result => {
                if (analytics.isBearishDojiStar(result, this.changes)) {
                  console.log('Bearish doji star detected');
                  this.sell();
                }
              })
            ;

            // three white soldiers
            analytics.findPatternThreeWhiteSoldiers(normalized)
              .then(result => {
                if (analytics.isBearishThreeWhiteSoldiers(result, this.changes)) {
                  console.log('Bearish three white soldiers detected');
                  this.sell();
                }
              })
            ;

            // engulfing
            analytics.findPatternEngulfing(normalized)
              .then(result => {
                if (analytics.isBearishEngulfing(result, this.changes)) {
                  console.log('Bearish engulfing detected');
                  this.sell();
                }
              })
            ;

            // engulfing
            analytics.findPatternThreeStarsInTheSouth(normalized)
              .then(result => {
                if (analytics.isBearishThreeStarsInTheSouth(result, this.changes)) {
                  console.log('Bearish three stars in the south detected');
                  this.sell();
                }
              })
            ;

            this.evaluated.push(lastCandlestick[0]);
          }
        }
      } else {
        out.log('Not enough profit: '+this.getProfitPercentage(lastBuy.price, this.currentValueSatoshi)+'%');
      }
    }
  }
}