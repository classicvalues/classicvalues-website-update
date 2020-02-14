/*
29.11.2019
*/

import AsyncLoad from '../../../src/async-load'

describe("Test async-load.js", function() {
  it("Test did AsyncLoad exist", function() {
    expect(typeof AsyncLoad).not.toBe('undefined')
  });
  it("Test AsyncLoad.VERSION function", function() {
    expect(AsyncLoad.VERSION).toEqual(jasmine.any(String))
  });
  it("Test AsyncLoad.Default function", function() {
    let expected = {
        defaultPage: 'main.html',
        errorPage: '404.html',
        subpagesDirectory: 'views/'
    }
    expect(AsyncLoad.Default).toEqual(expected)
  });
  it("Test AsyncLoad._getConfig function", function() {
    let expected = {
        defaultPage: 'main.html',
        errorPage: '404.html',
        subpagesDirectory: 'views/',
        'aaa': 'bbb'
    }
    expect(AsyncLoad.prototype._getConfig({'aaa': 'bbb'})).toEqual(expected)
  });
 /*
  it("Test AsyncLoad._loadPage.loadScripts function", function() {
    document.body.innerHTML += `
    <div id="al-a1"></div>`
    let src = ['scrypt/one', 'scrypt/two']
    //let asyncLoad = new AsyncLoad(document.getElementById('al-a1'), {})
    //asyncLoad._loadPage('url').loadScripts(src)
    AsyncLoad.prototype._loadPage('url').loadScripts(src)
    let scripts = document.getElementsByTagName('script')
    let expected = [
        'script/one', 'script/two'
    ]
    let result = []
    for(let i = 0; i<scripts.length; i++){
        result.push(scripts[i].src)
    }
    expect(result).toEqual(expected);
  });
*/
  /*
  it("Test AsyncLoad._loadPage.removeScripts function", function() {
    let src = ['scrypt/one', 'scrypt/two']
    AsyncLoad.prototype._loadPage('url').loadScripts(src)
    AsyncLoad.prototype._loadPage('url').removeScripts()
    let scripts = document.getElementsByTagName('script')
    expect( scripts.length ).toBe( 0 );
  });
*/
/*
  it("Test AsyncLoad._setUpUrl function", function() {
    document.body.innerHTML += `
    <div id="al-b0">
      <div class="c-sidebar-nav-dropdown">
        <div class="c-xhr-link c-sidebar-nav-link" id="al-b1" href="/url"></div>
      </div>
      <div class="c-sidebar-nav-dropdown>
        <div class="c-xhr-link c-sidebar-nav-link c-show c-active" id="al-b2" href="/nourl"></div>
      </div>
    </div>`
    let asyncLoad = new AsyncLoad(document.getElementById('al-b0'), {});
    asyncLoad._setUpUrl('url?lorem=ipsum')
    //AsyncLoad.prototype._setUpUrl('url?lorem=ipsum')
    let elementA = document.getElementById('al-b1');
    let elementB = document.getElementById('al-b2');
    expect( elementA.classList.contains('c-show')   ).toBe( true );
    expect( elementA.classList.contains('c-active') ).toBe( true );
    expect( elementA.classList.contains('c-show')   ).toBe( false );
    expect( elementA.classList.contains('c-active') ).toBe( false );
  });
*/
});