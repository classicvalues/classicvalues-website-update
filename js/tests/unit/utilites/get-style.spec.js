/*
29.11.2019
*/

import getStyle from '../../../src/utilities/get-style'

describe("Test utilites/get-style.js", function() {
  it("Test getStyle function", function() {
    document.body.innerHTML += '<div id="footer"></div><style>body{ width: 1000px; color: #fff; } #footer{ width: 400px; --color: #000; }</style>'
    expect(getStyle('width')).toEqual('1000px')
    let element = document.getElementById('footer')
    expect(getStyle('width', element)).toEqual('400px')
    expect(getStyle('--color', element)).toEqual('#000')
  });
});