"use strict";

import cfg from '../config.json';
import api from './api';
import out from './out';

export default class Trader {

  constructor(strategy, altSymbol, mainSymbol) {

    this.altSymbol = altSymbol;
    this.mainSymbol = mainSymbol;
    this.symbol = this.altSymbol + this.mainSymbol;

    this.strategy = strategy;
    this.strategy.trader = this;
  }

  start() {

    out.log('Starting...', out.colors.green);

    setInterval(() => {
      api.getBalance(this.mainSymbol)
        .then(balance => {
          this.strategy.mainBalance = balance.free;
          return api.getCandlesticks(this.symbol, cfg.candlesticksInterval, 25);
        })
        .then(candlesticks => {
          this.strategy.data = candlesticks;
          this.strategy.evaluate();
        })
      ;
    }, cfg.evaluationInterval);
  }

  buy(quantity) {
    out.log('buying ' + quantity, out.colors.green);

    api.buy(this.symbol, quantity).then(res => {
      console.log(res);
    });
  }

  sell(quantity) {
    out.log('selling ' + quantity, out.colors.red);

    api.sell(this.symbol, quantity).then(res => {
      console.log(res);
    });
  }
}