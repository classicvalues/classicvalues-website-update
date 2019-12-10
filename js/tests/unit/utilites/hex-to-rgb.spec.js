/*
28.11.2019
*/


import hexToRgb from '../../../src/utilities/hex-to-rgb.js'

describe("Test utilites/hex-to-rgb.js", function() {
  it("Test hexToRgb function", function() {
    expect(hexToRgb('#123')).toBe('rgba(1, 2, 3)')
    expect(hexToRgb('#010203')).toBe('rgba(1, 2, 3)')
  });

  it("Test hexToRgb function throw error on wrong color", function() {
    expect(function(){ hexToRgb('$#$#$#$#') }).toThrow(new Error('$#$#$#$# is not a valid hex color'));
  });

  it("Test hexToRgb function throw error on lack of parameter", function() {
    expect(function(){ hexToRgb() }).toThrow(new Error('Hex color is not defined'));
  });
});


