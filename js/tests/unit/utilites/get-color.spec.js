/*
29.11.2019
*/

import getColor from '../../../src/utilities/get-color'

describe("Test utilites/get-color.js", function() {
  it("Test getColor function", function() {
    document.body.innerHTML += '<div id="footer2"></div><style>body{ width: 1000px; --color: #fff; } #footer2{ width: 400px; --color: #000; }</style>'
    expect(getColor('color')).toBe('#fff')
    let element = document.getElementById('footer2')
    expect(getColor('color', element)).toBe('#000')
    expect(getColor('height', element)).toBe('height')
  });
});