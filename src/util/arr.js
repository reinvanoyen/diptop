"use strict";

const arr = {};

arr.contains = (haystack, needle) => {
  return (haystack.indexOf(needle) !== -1);
};

export default arr;