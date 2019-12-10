/*
28.11.2019
*/

import { checkBreakpoint } from '../../../src/utilities/classes.js'

describe("Test utilites/classes.js", function() {
  it("Test checkBreakpoint function", function() {
    expect(checkBreakpoint( 'A', ['A','B'] )).toBe(true);
    expect(checkBreakpoint( 'B', ['A','B'] )).toBe(true);
    expect(checkBreakpoint( 'C', ['A','B'] )).toBe(false);
  });
});


