"use strict";

var _config = require('../config.json');

var _config2 = _interopRequireDefault(_config);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _trader = require('./trader');

var _trader2 = _interopRequireDefault(_trader);

var _buylowsellhigh = require('./strategy/buylowsellhigh');

var _buylowsellhigh2 = _interopRequireDefault(_buylowsellhigh);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_api2.default.connect(_config2.default.apiKey, _config2.default.secret);

var trader = new _trader2.default(new _buylowsellhigh2.default(), _config2.default.altSymbol, _config2.default.mainSymbol);
trader.start();