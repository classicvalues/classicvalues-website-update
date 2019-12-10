/*
29.11.2019
*/

import getCssCustomProperties from '../../../src/utilities/get-css-custom-properties'

describe("Test utilites/get-css-custom-properties.js", function() {
  it("Test getCssCustomProperties function", function() {
    document.body.innerHTML += '<style>.ie-custom-properties{ width: 10px; color: #fff; } .footer{ height: 40px; }</style>'
    let result = {'--width': '10px', '--color': 'rgb(255, 255, 255)'}
    expect(getCssCustomProperties()).toEqual(result)
  });
});