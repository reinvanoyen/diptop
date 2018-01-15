"use strict";

import talib from 'talib';

talib.functions.forEach( f => console.log(f.name) );

const analytics = {};

analytics.normalize = (candlesticks) => {

  candlesticks.pop();

  let data = {
    open: [],
    high: [],
    low: [],
    close: [],
    volume: [],
  };

  candlesticks.forEach(cs => {
    data.open.push(parseFloat(cs[1]));
    data.high.push(parseFloat(cs[2]));
    data.low.push(parseFloat(cs[3]));
    data.close.push(parseFloat(cs[4]));
    data.volume.push(parseFloat(cs[5]));
  });

  return data;
};

analytics.getCurrentValue = (data) => {
  return parseFloat(data[data.length-1][4]);
};

analytics.valueChanges = (data) => {

  data.pop();

  return data.map(candlestick => {

    let open = analytics.toSatoshi(parseFloat(candlestick[1]));
    let close = analytics.toSatoshi(parseFloat(candlestick[4]));

    return parseInt( close - open );
  });
};

analytics.isBearish = (changes, offset) => {
  let bearish = [];

  while(changes[changes.length-(offset+1)] < 0) {
    bearish.push(changes[changes.length-(offset+1)]);
    offset++;
  }
  return (bearish.length > 1);
};

analytics.isBullish = (changes, offset) => {
  let bullish = [];

  while(changes[changes.length-(offset+1)] > 0) {
    bullish.push(changes[changes.length-(offset+1)]);
    offset++;
  }
  return (bullish.length > 1);
};

analytics.isBullishHammer = (data, changes) => {
  return (analytics.isBearish(changes) && data[data.length-1] === 100);
};

analytics.isBullishInvertedHammer = (data, changes) => {
  return (analytics.isBearish(changes) && data[data.length-1] === 100);
};

analytics.isBullishBeltHold = (data, changes) => {
  return (analytics.isBearish(changes) && data[data.length-1] === 100);
};

analytics.isBullishHaramiCross = (data, changes) => {
  return (analytics.isBearish(changes) && data[data.length-1] === 100);
};

analytics.isBullishAbandonedBaby = (data, changes) => {
  return (analytics.isBearish(changes) && data[data.length-1] === 100);
};

analytics.isBullishHarami = (harami, changes) => {
  return (analytics.isBearish(changes) && data[data.length-1] === 100);
};

analytics.isBullishKicking = (data, changes) => {
  return (analytics.isBearish(changes) && data[data.length-1] === 100);
};

analytics.isBullishMorningStar = (data, changes) => {
  return (analytics.isBearish(changes) && data[data.length-1] === 100);
};

analytics.isBullishDojiStar = (data, changes) => {
  return (analytics.isBearish(changes) && data[data.length-1] === 100);
};

analytics.isBullishThreeWhiteSoldiers = (data, changes) => {
  return (analytics.isBearish(changes, 2) && data[data.length-1] === 100);
};

analytics.isBullishEngulfing = (data, changes) => {
  return (analytics.isBearish(changes) && data[data.length-1] === 100);
};

analytics.isBullishThreeStarsInTheSouth = (data, changes) => {
  return (analytics.isBearish(changes, 2) && data[data.length-1] === 100);
};

analytics.isBearishHammer = (data, changes) => {
  return (analytics.isBullish(changes) && data[data.length-1] === 100);
};

analytics.isBearishInvertedHammer = (data, changes) => {
  return (analytics.isBullish(changes) && data[data.length-1] === 100);
};

analytics.isBearishBeltHold = (data, changes) => {
  return (analytics.isBullish(changes) && data[data.length-1] === 100);
};

analytics.isBearishHaramiCross = (data, changes) => {
  return (analytics.isBullish(changes) && data[data.length-1] === 100);
};

analytics.isBearishAbandonedBaby = (data, changes) => {
  return (analytics.isBullish(changes) && data[data.length-1] === 100);
};

analytics.isBearishHarami = (harami, changes) => {
  return (analytics.isBullish(changes) && data[data.length-1] === 100);
};

analytics.isBearishKicking = (data, changes) => {
  return (analytics.isBullish(changes) && data[data.length-1] === 100);
};

analytics.isBearishMorningStar = (data, changes) => {
  return (analytics.isBullish(changes) && data[data.length-1] === 100);
};

analytics.isBearishDojiStar = (data, changes) => {
  return (analytics.isBullish(changes) && data[data.length-1] === 100);
};

analytics.isBearishThreeWhiteSoldiers = (data, changes) => {
  return (analytics.isBullish(changes, 2) && data[data.length-1] === 100);
};

analytics.isBearishEngulfing = (data, changes) => {
  return (analytics.isBullish(changes) && data[data.length-1] === 100);
};

analytics.isBearishThreeStarsInTheSouth = (data, changes) => {
  return (analytics.isBullish(changes, 2) && data[data.length-1] === 100);
};

analytics.findPatternHammer = (data) => {
  return analytics.findPatternInCandlesticks('CDLHAMMER', data);
};

analytics.findPatternInvertedHammer = (data) => {
  return analytics.findPatternInCandlesticks('CDLINVERTEDHAMMER', data);
};

analytics.findPatternBeltHold = (data) => {
  return analytics.findPatternInCandlesticks('CDLBELTHOLD', data);
};

analytics.findPatternHarami = (data) => {
  return analytics.findPatternInCandlesticks('CDLHARAMI', data);
};

analytics.findPatternHaramiCross = (data) => {
  return analytics.findPatternInCandlesticks('CDLHARAMICROSS', data);
};

analytics.findPatternAbandonedBaby = (data) => {
  return analytics.findPatternInCandlesticks('CDLABANDONEDBABY', data);
};

analytics.findPatternKicking = (data) => {
  return analytics.findPatternInCandlesticks('CDLKICKING', data)
};

analytics.findPatternMorningStar = (data) => {
  return analytics.findPatternInCandlesticks('CDLMORNINGSTAR', data)
};

analytics.findPatternDojiStar = (data) => {
  return analytics.findPatternInCandlesticks('CDLDOJISTAR', data);
};

analytics.findPatternThreeWhiteSoldiers = (data) => {
  return analytics.findPatternInCandlesticks('CDL3WHITESOLDIERS', data);
};

analytics.findPatternEngulfing = (data) => {
  return analytics.findPatternInCandlesticks('CDLENGULFING', data);
};

analytics.findPatternThreeStarsInTheSouth = (data) => {
  return analytics.findPatternInCandlesticks('CDL3STARSINSOUTH', data);
};

analytics.findPatternInCandlesticks = (patternName, data) => {

  return new Promise((resolve, reject) => {
    talib.execute({
      name: patternName,
      startIdx: 0,
      endIdx: data.close.length - 1,
      open: data.open,
      high: data.high,
      low: data.low,
      close: data.close
    }, (err, result) => {
      if (!err && result) {
        resolve(result.result.outInteger);
      }
    });
  });
};

analytics.toSatoshi = (number) => {

  return parseInt( number * 100000000 );
};

export default analytics;