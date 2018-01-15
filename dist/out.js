"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var out = {
  colors: {
    green: '\x1b[32m',
    red: '\x1b[31m',
    greenBg: '\x1b[42m',
    redBg: '\x1b[41m'
  }
};

out.log = function (msg, color) {
  if (color) {
    console.log(color + '%s\x1b[0m', msg);
  } else {
    console.log(msg);
  }
};

out.changeBlock = function (data) {
  if (data[data.length - 1] > 0) {
    out.log('[CDL] ' + ' '.repeat(Math.abs(data[data.length - 1])), out.colors.greenBg);
  } else if (data[data.length - 1] < 0) {
    out.log('[CDL] ' + ' '.repeat(Math.abs(data[data.length - 1])), out.colors.redBg);
  } else {
    out.log('[CDL]');
  }
};

exports.default = out;