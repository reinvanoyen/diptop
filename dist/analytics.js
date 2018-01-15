"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _talib = require('talib');

var _talib2 = _interopRequireDefault(_talib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_talib2.default.functions.forEach(function (f) {
  return console.log(f.name);
});

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

analytics.isBearish = function (changes, offset) {
  var bearish = [];

  while (changes[changes.length - (offset + 1)] < 0) {
    bearish.push(changes[changes.length - (offset + 1)]);
    offset++;
  }
  return bearish.length > 1;
};

analytics.isBullish = function (changes, offset) {
  var bullish = [];

  while (changes[changes.length - (offset + 1)] > 0) {
    bullish.push(changes[changes.length - (offset + 1)]);
    offset++;
  }
  return bullish.length > 1;
};

analytics.isBullishHammer = function (data, changes) {
  return analytics.isBearish(changes) && data[data.length - 1] === 100;
};

analytics.isBullishInvertedHammer = function (data, changes) {
  return analytics.isBearish(changes) && data[data.length - 1] === 100;
};

analytics.isBullishBeltHold = function (data, changes) {
  return analytics.isBearish(changes) && data[data.length - 1] === 100;
};

analytics.isBullishHaramiCross = function (data, changes) {
  return analytics.isBearish(changes) && data[data.length - 1] === 100;
};

analytics.isBullishAbandonedBaby = function (data, changes) {
  return analytics.isBearish(changes) && data[data.length - 1] === 100;
};

analytics.isBullishHarami = function (harami, changes) {
  return analytics.isBearish(changes) && data[data.length - 1] === 100;
};

analytics.isBullishKicking = function (data, changes) {
  return analytics.isBearish(changes) && data[data.length - 1] === 100;
};

analytics.isBullishMorningStar = function (data, changes) {
  return analytics.isBearish(changes) && data[data.length - 1] === 100;
};

analytics.isBullishDojiStar = function (data, changes) {
  return analytics.isBearish(changes) && data[data.length - 1] === 100;
};

analytics.isBullishThreeWhiteSoldiers = function (data, changes) {
  return analytics.isBearish(changes, 2) && data[data.length - 1] === 100;
};

analytics.isBullishEngulfing = function (data, changes) {
  return analytics.isBearish(changes) && data[data.length - 1] === 100;
};

analytics.isBullishThreeStarsInTheSouth = function (data, changes) {
  return analytics.isBearish(changes, 2) && data[data.length - 1] === 100;
};

analytics.isBearishHammer = function (data, changes) {
  return analytics.isBullish(changes) && data[data.length - 1] === 100;
};

analytics.isBearishInvertedHammer = function (data, changes) {
  return analytics.isBullish(changes) && data[data.length - 1] === 100;
};

analytics.isBearishBeltHold = function (data, changes) {
  return analytics.isBullish(changes) && data[data.length - 1] === 100;
};

analytics.isBearishHaramiCross = function (data, changes) {
  return analytics.isBullish(changes) && data[data.length - 1] === 100;
};

analytics.isBearishAbandonedBaby = function (data, changes) {
  return analytics.isBullish(changes) && data[data.length - 1] === 100;
};

analytics.isBearishHarami = function (harami, changes) {
  return analytics.isBullish(changes) && data[data.length - 1] === 100;
};

analytics.isBearishKicking = function (data, changes) {
  return analytics.isBullish(changes) && data[data.length - 1] === 100;
};

analytics.isBearishMorningStar = function (data, changes) {
  return analytics.isBullish(changes) && data[data.length - 1] === 100;
};

analytics.isBearishDojiStar = function (data, changes) {
  return analytics.isBullish(changes) && data[data.length - 1] === 100;
};

analytics.isBearishThreeWhiteSoldiers = function (data, changes) {
  return analytics.isBullish(changes, 2) && data[data.length - 1] === 100;
};

analytics.isBearishEngulfing = function (data, changes) {
  return analytics.isBullish(changes) && data[data.length - 1] === 100;
};

analytics.isBearishThreeStarsInTheSouth = function (data, changes) {
  return analytics.isBullish(changes, 2) && data[data.length - 1] === 100;
};

analytics.findPatternHammer = function (data) {
  return analytics.findPatternInCandlesticks('CDLHAMMER', data);
};

analytics.findPatternInvertedHammer = function (data) {
  return analytics.findPatternInCandlesticks('CDLINVERTEDHAMMER', data);
};

analytics.findPatternBeltHold = function (data) {
  return analytics.findPatternInCandlesticks('CDLBELTHOLD', data);
};

analytics.findPatternHarami = function (data) {
  return analytics.findPatternInCandlesticks('CDLHARAMI', data);
};

analytics.findPatternHaramiCross = function (data) {
  return analytics.findPatternInCandlesticks('CDLHARAMICROSS', data);
};

analytics.findPatternAbandonedBaby = function (data) {
  return analytics.findPatternInCandlesticks('CDLABANDONEDBABY', data);
};

analytics.findPatternKicking = function (data) {
  return analytics.findPatternInCandlesticks('CDLKICKING', data);
};

analytics.findPatternMorningStar = function (data) {
  return analytics.findPatternInCandlesticks('CDLMORNINGSTAR', data);
};

analytics.findPatternDojiStar = function (data) {
  return analytics.findPatternInCandlesticks('CDLDOJISTAR', data);
};

analytics.findPatternThreeWhiteSoldiers = function (data) {
  return analytics.findPatternInCandlesticks('CDL3WHITESOLDIERS', data);
};

analytics.findPatternEngulfing = function (data) {
  return analytics.findPatternInCandlesticks('CDLENGULFING', data);
};

analytics.findPatternThreeStarsInTheSouth = function (data) {
  return analytics.findPatternInCandlesticks('CDL3STARSINSOUTH', data);
};

analytics.findPatternInCandlesticks = function (patternName, data) {

  return new Promise(function (resolve, reject) {
    _talib2.default.execute({
      name: patternName,
      startIdx: 0,
      endIdx: data.close.length - 1,
      open: data.open,
      high: data.high,
      low: data.low,
      close: data.close
    }, function (err, result) {
      if (!err && result) {
        resolve(result.result.outInteger);
      }
    });
  });
};

analytics.toSatoshi = function (number) {

  return parseInt(number * 100000000);
};

exports.default = analytics;