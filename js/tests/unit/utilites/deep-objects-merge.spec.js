/*
28.11.2019
*/


import deepObjectsMerge from '../../../src/utilities/deep-objects-merge.js'

describe("Test utilites/deep-obects-merge.js", function() {
  it("Test deepObjectsMerge function", function() {
    let expected = {a: { g: 3, b: 1 }, c: { d: 4, e: 5 }, i: 9, h: 6}
    let obj1 = {a: {b: 1}, c: {d: 2}, i: 9}
    let obj2 = {a: {g: 3}, c: {d: 4, e: 5}, h:6}
    let result = deepObjectsMerge(obj1, obj2)
    expect(result).toEqual(expected)
  });
});
