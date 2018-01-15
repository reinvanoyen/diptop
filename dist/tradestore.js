"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = {};
var FILENAME = 'tradestore.json';

store.getAll = function () {

  try {
    return JSON.parse(_fs2.default.readFileSync(FILENAME));
  } catch (error) {
    return {};
  }
};

store.addTrade = function (symbol, price, quantity) {

  var all = store.getAll();
  all[symbol] = {
    price: price,
    quantity: quantity
  };

  _fs2.default.writeFileSync(FILENAME, JSON.stringify(all));
};

store.getTrade = function (symbol) {

  var all = store.getAll();

  if (all[symbol]) {
    return all[symbol];
  }

  return false;
};

store.removeTrade = function (symbol) {

  var all = store.getAll();

  if (all[symbol]) {
    delete all[symbol];
  }

  _fs2.default.writeFileSync(FILENAME, JSON.stringify(all));
};

exports.default = store;