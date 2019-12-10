/*
28.11.2019
*/


import rgbToHex from '../../../src/utilities/rgb-to-hex.js'

describe("Test utilites/rgb-to-hex.js", function() {
  it("Test rgbToHex function", function() {
    expect(rgbToHex('transparent')).toBe('#00000000')
    expect(rgbToHex('rgba(20,40,60)')).toBe('#14283c')
    expect(rgbToHex('rgba(40,60,80)')).toBe('#283c50')
  });

  it("Test rgbToHex function throw error on wrong color", function() {
    expect(function(){ rgbToHex('$#$#$#$#') }).toThrow(new Error('$#$#$#$# is not a valid rgb color'));
  });

  it("Test rgbToHex function throw error on lack of parameter", function() {
    expect(function(){ rgbToHex() }).toThrow(new Error('RGB color is not defined'));
  });
});

