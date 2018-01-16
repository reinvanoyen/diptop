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
    this.lastBuy = null;
    this.hasTrade = false;
  }

  assertProfit(buyValue, sellValue) {

    let diff = sellValue - buyValue;
    if (diff < 0) {
      return false;
    }
    return (this.getProfitPercentage(buyValue, sellValue) > cfg.minProfitPercentage);
  }

  static getProfitPercentage(buyValue, sellValue) {

    let diff = sellValue - buyValue;
    return (diff/buyValue)*100;
  }

  buy() {

    let quantity = Math.floor(cfg.maxTrade / this.currentValueSatoshi);

    console.log(this.currentValueSatoshi);
    this.trader.buy(quantity);
    tradestore.addTrade(this.trader.symbol, this.currentValueSatoshi, quantity);
  }

  sell() {

    let quantity = tradestore.getTrade(this.trader.symbol).quantity;

    console.log(this.currentValueSatoshi);
    this.trader.sell(quantity);
    tradestore.removeTrade(this.trader.symbol);
  }

  buyMode() {
    out.log('Looking to buy');

    let normalizedData = analytics.normalize(this.data);

    if (analytics.isBullishHaramiCross(normalizedData)) {
      out.log('Bullish Harami Cross found!');
    } else if (analytics.isAbandonedBaby(normalizedData)) {
      out.log('Abandoned baby!');
    } else if (analytics.isThreeBlackCrows(normalizedData)) {
      out.log('Black crows!');
    } else if (analytics.isThreeWhiteSoldiers(normalizedData)) {
      out.log('Three whites!');
    }
  }

  sellMode() {
    out.log('Looking to sell');

    if (this.assertProfit(this.lastBuy.price, this.currentValueSatoshi)) {
      out.log('Current trade profit: ' + this.getProfitPercentage(this.lastBuy.price, this.currentValueSatoshi) + '%');

      if (this.getProfitPercentage(this.lastBuy.price, this.currentValueSatoshi) > cfg.instantSellPercentage) {

        out.log('Instant sell percentage hit');
        this.sell();

      } else {

      }
    }
  }

  isEvaluated() {
    let lastCandlestick = this.data[this.data.length-1];
    return (arr.contains(this.evaluated, lastCandlestick[0]));
  }

  evaluate() {

    this.lastBuy = tradestore.getTrade(this.trader.symbol);
    this.hasTrade = Boolean(this.lastBuy);

    this.changes = analytics.valueChanges(this.data);

    if (! this.isEvaluated()) {

      out.changeBlock(this.changes);

      this.currentValue = analytics.getCurrentValue(this.data);
      this.currentValueSatoshi = analytics.toSatoshi(this.currentValue);

      out.log('Current Satoshis: '+this.currentValueSatoshi);

      if (!this.hasTrade) {
        this.buyMode();
      } else {
        this.sellMode();
      }

      let lastCandlestick = this.data[this.data.length-1];
      this.evaluated.push(lastCandlestick[0]);
    }
  }
}