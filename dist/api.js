"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _https = require('https');

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api = {};

var userAgent = 'Mozilla/4.0 (compatible; Node Binance API)';
var contentType = 'application/x-www-form-urlencoded';

var API_HOST = 'api.binance.com';
var API_KEY = void 0;
var API_SECRET = void 0;

var createUrlParams = function createUrlParams(data) {
  var query = Object.keys(data).reduce(function (a, k) {
    a.push(k + '=' + encodeURIComponent(data[k]));
    return a;
  }, []).join('&');

  return query ? '?' + query : '';
};

var request = function request(params, postData) {

  return new Promise(function (resolve, reject) {

    var r = (0, _https.request)(params, function (res) {

      var body = [];

      res.on('data', function (chunk) {
        body.push(chunk);
      });

      res.on('end', function () {
        try {
          body = JSON.parse(body.join(''));
        } catch (e) {
          reject(e);
        }

        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error('statusCode=' + res.statusCode + ' - ' + body.msg));
        }

        resolve(body);
      });
    });

    r.on('error', function (err) {
      reject(err);
    });

    if (postData) {
      r.write(postData);
    }

    r.end();
  });
};

var apiRequest = function apiRequest(path) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';

  return request({
    hostname: API_HOST,
    method: method,
    path: path + createUrlParams(data)
  });
};

var signedRequest = function signedRequest(path) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';


  if (!API_SECRET) {
    throw 'signedRequest: Invalid API Secret';
  }

  data.timestamp = new Date().getTime();
  var query = _querystring2.default.stringify(data);
  data.signature = _crypto2.default.createHmac('sha256', API_SECRET).update(query).digest('hex');

  if (method === 'GET' || method === 'POST') {
    path = path + createUrlParams(data);
  }

  var opts = {
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

api.connect = function (key, secret) {
  API_KEY = key;
  API_SECRET = secret;
};

api.getServerTime = function () {
  return apiRequest('/api/v1/time');
};

api.getTradeIndex = function (symbol) {
  return signedRequest('/api/v3/myTrades', {
    symbol: symbol
  });
};

api.buy = function (symbol, quantity) {
  return signedRequest('/api/v3/order', {
    symbol: symbol,
    side: 'BUY',
    type: 'MARKET',
    quantity: quantity
  }, 'POST');
};

api.sell = function (symbol, quantity) {
  return signedRequest('/api/v3/order', {
    symbol: symbol,
    side: 'SELL',
    type: 'MARKET',
    quantity: quantity
  }, 'POST');
};

api.getCandlesticks = function (symbol, interval, amount) {

  return apiRequest('/api/v1/klines', {
    symbol: symbol,
    limit: amount,
    interval: interval
  });
};

api.getBalance = function (symbol) {

  return new Promise(function (resolve, reject) {

    return signedRequest('/api/v3/account').then(function (res) {

      var balance = res.balances.filter(function (balance) {
        return balance.asset === symbol;
      });

      balance = balance[0];

      resolve(balance);
    });
  });
};

exports.default = api;