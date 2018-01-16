"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = require('../../config.json');

var _config2 = _interopRequireDefault(_config);

var _analytics = require('../analytics');

var _analytics2 = _interopRequireDefault(_analytics);

var _out = require('../out');

var _out2 = _interopRequireDefault(_out);

var _arr = require('../util/arr');

var _arr2 = _interopRequireDefault(_arr);

var _tradestore = require('../tradestore');

var _tradestore2 = _interopRequireDefault(_tradestore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BuyLowSellHigh = function () {
  function BuyLowSellHigh() {
    _classCallCheck(this, BuyLowSellHigh);

    this.trader = null;
    this.mainBalance = 0;
    this.currentValue = 0;
    this.data = [];
    this.changes = [];
    this.evaluated = [];
    this.lastBuy = null;
    this.hasTrade = false;
  }

  _createClass(BuyLowSellHigh, [{
    key: 'assertProfit',
    value: function assertProfit(buyValue, sellValue) {

      var diff = sellValue - buyValue;
      if (diff < 0) {
        return false;
      }
      return this.getProfitPercentage(buyValue, sellValue) > _config2.default.minProfitPercentage;
    }
  }, {
    key: 'buy',
    value: function buy() {

      var quantity = Math.floor(_config2.default.maxTrade / this.currentValueSatoshi);

      console.log(this.currentValueSatoshi);
      this.trader.buy(quantity);
      _tradestore2.default.addTrade(this.trader.symbol, this.currentValueSatoshi, quantity);
    }
  }, {
    key: 'sell',
    value: function sell() {

      var quantity = _tradestore2.default.getTrade(this.trader.symbol).quantity;

      console.log(this.currentValueSatoshi);
      this.trader.sell(quantity);
      _tradestore2.default.removeTrade(this.trader.symbol);
    }
  }, {
    key: 'buyMode',
    value: function buyMode() {
      _out2.default.log('Looking to buy');

      var normalizedData = _analytics2.default.normalize(this.data);

      if (_analytics2.default.isBullishHaramiCross(normalizedData)) {
        _out2.default.log('Bullish Harami Cross found!');
      } else if (_analytics2.default.isAbandonedBaby(normalizedData)) {
        _out2.default.log('Abandoned baby!');
      } else if (_analytics2.default.isThreeBlackCrows(normalizedData)) {
        _out2.default.log('Black crows!');
      } else if (_analytics2.default.isThreeWhiteSoldiers(normalizedData)) {
        _out2.default.log('Three whites!');
      }
    }
  }, {
    key: 'sellMode',
    value: function sellMode() {
      _out2.default.log('Looking to sell');

      if (this.assertProfit(this.lastBuy.price, this.currentValueSatoshi)) {
        _out2.default.log('Current trade profit: ' + this.getProfitPercentage(this.lastBuy.price, this.currentValueSatoshi) + '%');

        if (this.getProfitPercentage(this.lastBuy.price, this.currentValueSatoshi) > _config2.default.instantSellPercentage) {

          _out2.default.log('Instant sell percentage hit');
          this.sell();
        } else {}
      }
    }
  }, {
    key: 'isEvaluated',
    value: function isEvaluated() {
      var lastCandlestick = this.data[this.data.length - 1];
      return _arr2.default.contains(this.evaluated, lastCandlestick[0]);
    }
  }, {
    key: 'evaluate',
    value: function evaluate() {

      this.lastBuy = _tradestore2.default.getTrade(this.trader.symbol);
      this.hasTrade = Boolean(this.lastBuy);

      this.changes = _analytics2.default.valueChanges(this.data);

      if (!this.isEvaluated()) {

        _out2.default.changeBlock(this.changes);

        this.currentValue = _analytics2.default.getCurrentValue(this.data);
        this.currentValueSatoshi = _analytics2.default.toSatoshi(this.currentValue);

        _out2.default.log('Current Satoshis: ' + this.currentValueSatoshi);

        if (!this.hasTrade) {
          this.buyMode();
        } else {
          this.sellMode();
        }

        var lastCandlestick = this.data[this.data.length - 1];
        this.evaluated.push(lastCandlestick[0]);
      }
    }
  }], [{
    key: 'getProfitPercentage',
    value: function getProfitPercentage(buyValue, sellValue) {

      var diff = sellValue - buyValue;
      return diff / buyValue * 100;
    }
  }]);

  return BuyLowSellHigh;
}();

exports.default = BuyLowSellHigh;