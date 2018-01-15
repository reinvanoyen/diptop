"use strict";

const out = {
  colors: {
    green: '\x1b[32m',
    red: '\x1b[31m',
    greenBg: '\x1b[42m',
    redBg: '\x1b[41m'
  }
};

out.log = (msg, color) => {
  if (color) {
    console.log(color+'%s\x1b[0m', msg);
  } else {
    console.log(msg);
  }
};

out.changeBlock = (data) => {
  if (data[data.length-1] > 0) {
    out.log('[CDL] ' + (' ').repeat(Math.abs(data[data.length-1])), out.colors.greenBg);
  } else if(data[data.length-1] < 0) {
    out.log('[CDL] ' + (' ').repeat(Math.abs(data[data.length-1])), out.colors.redBg);
  } else {
    out.log('[CDL]');
  }
};

export default out;