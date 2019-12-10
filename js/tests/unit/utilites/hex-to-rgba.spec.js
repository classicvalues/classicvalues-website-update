/*
29.11.2019
*/

import hexToRgba from '../../../src/utilities/hex-to-rgba.js'

describe("Test utilites/hex-to-rgba.js", function() {
  it("Test hexToRgba function", function() {
    expect(hexToRgba('#123')).toBe('rgba(1, 2, 3, 1)')
    expect(hexToRgba('#010203')).toBe('rgba(1, 2, 3, 1)')
    expect(hexToRgba('#123', 50)).toBe('rgba(1, 2, 3, 0.5)')
    expect(hexToRgba('#010203', 50)).toBe('rgba(1, 2, 3, 0.5)')
  });

  it("Test hexToRgba function throw error on wrong color", function() {
    expect(function(){ hexToRgba('$#$#$#$#') }).toThrow(new Error('$#$#$#$# is not a valid hex color'));
  });

  it("Test hexToRgba function throw error on lack of parameter", function() {
    expect(function(){ hexToRgba() }).toThrow(new Error('Hex color is not defined'));
  });
});