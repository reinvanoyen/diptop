"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = require('../config.json');

var _config2 = _interopRequireDefault(_config);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _out = require('./out');

var _out2 = _interopRequireDefault(_out);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Trader = function () {
  function Trader(strategy, altSymbol, mainSymbol) {
    _classCallCheck(this, Trader);

    this.altSymbol = altSymbol;
    this.mainSymbol = mainSymbol;
    this.symbol = this.altSymbol + this.mainSymbol;

    this.strategy = strategy;
    this.strategy.trader = this;
  }

  _createClass(Trader, [{
    key: 'start',
    value: function start() {
      var _this = this;

      _out2.default.log('Starting...', _out2.default.colors.green);

      setInterval(function () {
        _api2.default.getBalance(_this.mainSymbol).then(function (balance) {
          _this.strategy.mainBalance = balance.free;
          return _api2.default.getCandlesticks(_this.symbol, _config2.default.candlesticksInterval, 25);
        }).then(function (candlesticks) {
          _this.strategy.data = candlesticks;
          _this.strategy.evaluate();
        });
      }, _config2.default.evaluationInterval);
    }
  }, {
    key: 'buy',
    value: function buy(quantity) {
      _out2.default.log('buying ' + quantity, _out2.default.colors.green);

      _api2.default.buy(this.symbol, quantity).then(function (res) {
        console.log(res);
      });
    }
  }, {
    key: 'sell',
    value: function sell(quantity) {
      _out2.default.log('selling ' + quantity, _out2.default.colors.red);

      _api2.default.sell(this.symbol, quantity).then(function (res) {
        console.log(res);
      });
    }
  }]);

  return Trader;
}();

exports.default = Trader;