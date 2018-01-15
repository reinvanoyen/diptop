"use strict";

import cfg from '../config.json';
import api from './api';
import Trader from './trader';
import BuyLowSellHigh from './strategy/buylowsellhigh';

api.connect(cfg.apiKey, cfg.secret);

let trader = new Trader(new BuyLowSellHigh(), cfg.altSymbol, cfg.mainSymbol);
trader.start();