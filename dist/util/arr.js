"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var arr = {};

arr.contains = function (haystack, needle) {
  return haystack.indexOf(needle) !== -1;
};

exports.default = arr;