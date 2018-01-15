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
    key: 'getProfitPercentage',
    value: function getProfitPercentage(buyValue, sellValue) {

      var diff = sellValue - buyValue;
      return diff / buyValue * 100;
    }
  }, {
    key: 'buy',
    value: function buy() {

      var quantity = Math.floor(_config2.default.maxTrade / this.currentValueSatoshi);
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
    key: 'evaluate',
    value: function evaluate() {
      var _this = this;

      var lastBuy = _tradestore2.default.getTrade(this.trader.symbol);
      this.hasTrade = Boolean(lastBuy);

      var lastCandlestick = this.data[this.data.length - 1];
      this.currentValue = _analytics2.default.getCurrentValue(this.data);
      this.currentValueSatoshi = _analytics2.default.toSatoshi(this.currentValue);

      this.changes = _analytics2.default.valueChanges(this.data);

      if (!this.hasTrade) {

        _out2.default.log('Looking to buy');

        if (!_arr2.default.contains(this.evaluated, lastCandlestick[0])) {

          _out2.default.changeBlock(this.changes);

          var normalized = _analytics2.default.normalize(this.data);

          // belt holds
          _analytics2.default.findPatternBeltHold(normalized).then(function (result) {
            if (_analytics2.default.isBullishBeltHold(result, _this.changes)) {
              console.log('Bullish belt hold detected');
              _this.buy();
            }
          });

          // hammers
          _analytics2.default.findPatternHammer(normalized).then(function (result) {
            if (_analytics2.default.isBullishHammer(result, _this.changes)) {
              console.log('Bullish hammer detected');
              _this.buy();
            }
          });

          // inverted hammers
          _analytics2.default.findPatternInvertedHammer(normalized).then(function (result) {
            if (_analytics2.default.isBullishInvertedHammer(result, _this.changes)) {
              console.log('Bullish inverted hammer detected');
              _this.buy();
            }
          });

          // harami
          _analytics2.default.findPatternHarami(normalized).then(function (result) {
            if (_analytics2.default.isBullishHarami(result, _this.changes)) {
              console.log('Bullish harami detected');
              _this.buy();
            }
          });

          // harami cross
          _analytics2.default.findPatternHaramiCross(normalized).then(function (result) {
            if (_analytics2.default.isBullishHaramiCross(result, _this.changes)) {
              console.log('Bullish harami cross detected');
              _this.buy();
            }
          });

          // abandoned baby
          _analytics2.default.findPatternAbandonedBaby(normalized).then(function (result) {
            if (_analytics2.default.isBullishAbandonedBaby(result, _this.changes)) {
              console.log('Bullish abandoned baby detected');
              _this.buy();
            }
          });

          // kicking
          _analytics2.default.findPatternKicking(normalized).then(function (result) {
            if (_analytics2.default.isBullishKicking(result, _this.changes)) {
              console.log('Bullish kicking detected');
              _this.buy();
            }
          });

          // morning star
          _analytics2.default.findPatternKicking(normalized).then(function (result) {
            if (_analytics2.default.isBullishMorningStar(result, _this.changes)) {
              console.log('Bullish morning star detected');
              _this.buy();
            }
          });

          // doji star
          _analytics2.default.findPatternDojiStar(normalized).then(function (result) {
            if (_analytics2.default.isBullishDojiStar(result, _this.changes)) {
              console.log('Bullish doji star detected');
              _this.buy();
            }
          });

          // three white soldiers
          _analytics2.default.findPatternThreeWhiteSoldiers(normalized).then(function (result) {
            if (_analytics2.default.isBullishThreeWhiteSoldiers(result, _this.changes)) {
              console.log('Bullish three white soldiers detected');
              _this.buy();
            }
          });

          // engulfing
          _analytics2.default.findPatternEngulfing(normalized).then(function (result) {
            if (_analytics2.default.isBullishEngulfing(result, _this.changes)) {
              console.log('Bullish engulfing detected');
              _this.buy();
            }
          });

          // engulfing
          _analytics2.default.findPatternThreeStarsInTheSouth(normalized).then(function (result) {
            if (_analytics2.default.isBullishThreeStarsInTheSouth(result, _this.changes)) {
              console.log('Bullish three stars in the south detected');
              _this.buy();
            }
          });

          this.evaluated.push(lastCandlestick[0]);
        }
      } else if (this.hasTrade) {

        _out2.default.log('Looking to sell ' + lastBuy.price);

        if (this.assertProfit(lastBuy.price, this.currentValueSatoshi)) {

          _out2.default.log('Current trade profit: ' + this.getProfitPercentage(lastBuy.price, this.currentValueSatoshi) + '%');

          if (this.getProfitPercentage(lastBuy.price, this.currentValueSatoshi) > _config2.default.instantSellPercentage) {

            _out2.default.log('Instant sell percentage hit');
            this.sell();
          } else {

            if (!_arr2.default.contains(this.evaluated, lastCandlestick[0])) {

              _out2.default.changeBlock(this.changes);

              var _normalized = _analytics2.default.normalize(this.data);

              // belt holds
              _analytics2.default.findPatternBeltHold(_normalized).then(function (result) {
                if (_analytics2.default.isBearishBeltHold(result, _this.changes)) {
                  console.log('Bearish belt hold detected');
                  _this.sell();
                }
              });

              // hammers
              _analytics2.default.findPatternHammer(_normalized).then(function (result) {
                if (_analytics2.default.isBearishHammer(result, _this.changes)) {
                  console.log('Bearish hammer detected');
                  _this.sell();
                }
              });

              // inverted hammers
              _analytics2.default.findPatternInvertedHammer(_normalized).then(function (result) {
                if (_analytics2.default.isBearishInvertedHammer(result, _this.changes)) {
                  console.log('Bearish inverted hammer detected');
                  _this.sell();
                }
              });

              // harami
              _analytics2.default.findPatternHarami(_normalized).then(function (result) {
                if (_analytics2.default.isBearishHarami(result, _this.changes)) {
                  console.log('Bearish harami detected');
                  _this.sell();
                }
              });

              // harami cross
              _analytics2.default.findPatternHaramiCross(_normalized).then(function (result) {
                if (_analytics2.default.isBearishHaramiCross(result, _this.changes)) {
                  console.log('Bearish harami cross detected');
                  _this.buy();
                }
              });

              // abandoned baby
              _analytics2.default.findPatternAbandonedBaby(_normalized).then(function (result) {
                if (_analytics2.default.isBearishAbandonedBaby(result, _this.changes)) {
                  console.log('Bearish abandoned baby detected');
                  _this.sell();
                }
              });

              // kicking
              _analytics2.default.findPatternKicking(_normalized).then(function (result) {
                if (_analytics2.default.isBearishKicking(result, _this.changes)) {
                  console.log('Bearish kicking detected');
                  _this.sell();
                }
              });

              // morning star
              _analytics2.default.findPatternKicking(_normalized).then(function (result) {
                if (_analytics2.default.isBearishMorningStar(result, _this.changes)) {
                  console.log('Bearish morning star detected');
                  _this.sell();
                }
              });

              // doji star
              _analytics2.default.findPatternDojiStar(_normalized).then(function (result) {
                if (_analytics2.default.isBearishDojiStar(result, _this.changes)) {
                  console.log('Bearish doji star detected');
                  _this.sell();
                }
              });

              // three white soldiers
              _analytics2.default.findPatternThreeWhiteSoldiers(_normalized).then(function (result) {
                if (_analytics2.default.isBearishThreeWhiteSoldiers(result, _this.changes)) {
                  console.log('Bearish three white soldiers detected');
                  _this.sell();
                }
              });

              // engulfing
              _analytics2.default.findPatternEngulfing(_normalized).then(function (result) {
                if (_analytics2.default.isBearishEngulfing(result, _this.changes)) {
                  console.log('Bearish engulfing detected');
                  _this.sell();
                }
              });

              // engulfing
              _analytics2.default.findPatternThreeStarsInTheSouth(_normalized).then(function (result) {
                if (_analytics2.default.isBearishThreeStarsInTheSouth(result, _this.changes)) {
                  console.log('Bearish three stars in the south detected');
                  _this.sell();
                }
              });

              this.evaluated.push(lastCandlestick[0]);
            }
          }
        } else {
          _out2.default.log('Not enough profit: ' + this.getProfitPercentage(lastBuy.price, this.currentValueSatoshi) + '%');
        }
      }
    }
  }]);

  return BuyLowSellHigh;
}();

exports.default = BuyLowSellHigh;