"use strict";

const ti = require('technicalindicators');

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

analytics.toSatoshi = (number) => {

  return parseInt( number * 100000000 );
};

analytics.isAbandonedBaby = (data) => {
  return ti.abandonedbaby(data);
};

analytics.isBullishHaramiCross = (data) => {
  return ti.bullishharamicross(data);
};

analytics.isThreeWhiteSoldiers = (data) => {
  return ti.threewhitesoldiers(data);
};

analytics.isThreeBlackCrows = (data) => {
  return ti.threeblackcrows(data);
};

export default analytics;