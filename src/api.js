"use strict";

import { request as req } from 'https';
import crypto from 'crypto';
import querystring from 'querystring';

const api = {};

const userAgent = 'Mozilla/4.0 (compatible; Node Binance API)';
const contentType = 'application/x-www-form-urlencoded';

let API_HOST = 'api.binance.com';
let API_KEY;
let API_SECRET;

const createUrlParams = (data) => {
  let query = Object.keys(data).reduce((a,k) => {
    a.push(k+'='+encodeURIComponent(data[k]));
    return a;
  },[]).join('&');

  return ( query ? '?' + query : '' );
};

const request = (params, postData) => {

  return new Promise((resolve, reject) => {

    let r = req(params, res => {

      let body = [];

      res.on('data', (chunk) => {
        body.push(chunk);
      });

      res.on('end', () => {
        try {
          body = JSON.parse(body.join(''));
        } catch(e) {
          reject(e);
        }

        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error('statusCode=' + res.statusCode + ' - ' + body.msg));
        }

        resolve(body);
      });
    });

    r.on('error', (err) => {
      reject(err);
    });

    if (postData) {
      r.write(postData);
    }

    r.end();
  });
};

const apiRequest = (path, data = {}, method = 'GET') => {
  return request({
    hostname: API_HOST,
    method: method,
    path: path + createUrlParams(data)
  });
};

const signedRequest = (path, data = {}, method = 'GET') => {

  if (!API_SECRET) {
    throw 'signedRequest: Invalid API Secret';
  }

  data.timestamp = new Date().getTime();
  let query = querystring.stringify(data);
  data.signature = crypto.createHmac('sha256', API_SECRET).update(query).digest('hex');

  if (method === 'GET' || method === 'POST') {
    path = path+createUrlParams(data);
  }

  let opts = {
    hostname: API_HOST,
    path: path,
    method: method,
    agent: false,
    headers: {
      'User-Agent': userAgent,
      'Content-type': contentType,
      'X-MBX-APIKEY': API_KEY
    }
  };

  return request(opts);
};

api.connect = ( key, secret ) => {
  API_KEY = key;
  API_SECRET = secret;
};

api.getServerTime = () => {
  return apiRequest('/api/v1/time');
};

api.getTradeIndex = (symbol) => {
  return signedRequest('/api/v3/myTrades', {
    symbol: symbol
  });
};

api.buy = (symbol, quantity) => {
  return signedRequest('/api/v3/order', {
    symbol: symbol,
    side: 'BUY',
    type: 'MARKET',
    quantity: quantity
  }, 'POST');
};

api.sell = (symbol, quantity) => {
  return signedRequest('/api/v3/order', {
    symbol: symbol,
    side: 'SELL',
    type: 'MARKET',
    quantity: quantity
  }, 'POST');
};

api.getCandlesticks = (symbol, interval, amount) => {

  return apiRequest('/api/v1/klines', {
    symbol: symbol,
    limit: amount,
    interval: interval
  });
};

api.getBalance = (symbol) => {

  return new Promise((resolve, reject) => {

    return signedRequest('/api/v3/account')
      .then(res => {

        let balance = res.balances.filter(balance => {
          return ( balance.asset === symbol );
        });

        balance = balance[ 0 ];

        resolve(balance);
      });
  });
};

export default api;