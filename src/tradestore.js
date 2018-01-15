"use strict";

import fs from 'fs';

const store = {};
const FILENAME = 'tradestore.json';

store.getAll = () => {

  try {
    return JSON.parse(fs.readFileSync(FILENAME));
  } catch(error) {
    return {};
  }
};

store.addTrade = (symbol, price, quantity) => {

  let all = store.getAll();
  all[symbol] = {
    price: price,
    quantity: quantity
  };

  fs.writeFileSync(FILENAME, JSON.stringify(all));
};

store.getTrade = (symbol) => {

  let all = store.getAll();

  if (all[symbol]) {
    return all[symbol];
  }

  return false;
};

store.removeTrade = (symbol) => {

  let all = store.getAll();

  if (all[symbol]) {
    delete all[symbol];
  }

  fs.writeFileSync(FILENAME, JSON.stringify(all));
};

export default store;