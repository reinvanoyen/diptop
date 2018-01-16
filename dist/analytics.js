"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ti = require('technicalindicators');

var analytics = {};

analytics.normalize = function (candlesticks) {

  candlesticks.pop();

  var data = {
    open: [],
    high: [],
    low: [],
    close: [],
    volume: []
  };

  candlesticks.forEach(function (cs) {
    data.open.push(parseFloat(cs[1]));
    data.high.push(parseFloat(cs[2]));
    data.low.push(parseFloat(cs[3]));
    data.close.push(parseFloat(cs[4]));
    data.volume.push(parseFloat(cs[5]));
  });

  return data;
};

analytics.getCurrentValue = function (data) {

  return parseFloat(data[data.length - 1][4]);
};

analytics.valueChanges = function (data) {

  data.pop();

  return data.map(function (candlestick) {

    var open = analytics.toSatoshi(parseFloat(candlestick[1]));
    var close = analytics.toSatoshi(parseFloat(candlestick[4]));

    return parseInt(close - open);
  });
};

analytics.toSatoshi = function (number) {

  return parseInt(number * 100000000);
};

analytics.isAbandonedBaby = function (data) {
  return ti.abandonedbaby(data);
};

analytics.isBullishHaramiCross = function (data) {
  return ti.bullishharamicross(data);
};

analytics.isThreeWhiteSoldiers = function (data) {
  return ti.threewhitesoldiers(data);
};

analytics.isThreeBlackCrows = function (data) {
  return ti.threeblackcrows(data);
};

exports.default = analytics;