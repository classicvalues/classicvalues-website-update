/*
29.11.2019
*/

import Sidebar from '../../../src/sidebar'
import Data from '../../../src/dom/data'

describe("Test sidebar.js", function() {
  it("Test did Sidebar exist", function() {
    expect(typeof Sidebar).not.toBe('undefined')
  })
  it("Test Sidebar.VERSION function", function() {
    expect(Sidebar.VERSION).toEqual(jasmine.any(String))
  })
  it("Test Sidebar.DefaultType function", function() {
    let expected = {
        dropdownAccordion: 'boolean'
      }
    expect(Sidebar.DefaultType).toEqual(expected)
  })

  it("Test Sidebar._getAllSiblings function", function() {
    document.body.innerHTML += `
      <div>
        <p id="sidebar-elea1">
          <h2 id="sidebar-elea2"></h2>
        </p>
        <h3 id="sidebar-elea3" class="sb-a1"></h3>
      </div>
      <div></div>`
    let expected = [
      document.getElementById('sidebar-elea1'), 
      document.getElementById('sidebar-elea2'), 
      document.getElementsByTagName("p")[1],
      document.getElementById('sidebar-elea3')
    ] 
    let element = document.getElementById('sidebar-elea1')
    expect(Sidebar.prototype._getAllSiblings(element)).toEqual(expected)
    let filter = function(element){
      let result = false
      if(element.classList.contains('sb-a1')){
        result = true
      }
      return result
    }
    expected = [document.getElementById('sidebar-elea3')]
    expect(Sidebar.prototype._getAllSiblings(element, filter)).toEqual(expected)
  })
  it("Test Sidebar._destroyScrollbar function", function() {
    Sidebar.prototype.ps = { destroy: function(){} }
    Sidebar.prototype._destroyScrollbar() 
    expect( Sidebar.prototype.ps ).toBe( null )
  })
  it("Test Sidebar._getParents function", function(){
    document.body.innerHTML += `<div id="sb-ele-2"><div id="sb-ele-1" class="sb-b1"><h2 id="sidebar-ele2"></h2></div><h3></h3></div><div></div>`
    let expected = [
      document.getElementById('sidebar-ele2'), 
      document.getElementById('sb-ele-1'), 
      document.getElementById('sb-ele-2'), 
      document.getElementsByTagName('body')[0], 
      document.getElementsByTagName('html')[0]
  ]
    let element = document.getElementById('sidebar-ele2')
    let result = Sidebar.prototype._getParents(element)
    expect( result ).toEqual( expected )
    expected = [
      document.getElementById('sb-ele-1')
    ]
    result = Sidebar.prototype._getParents(element, '.sb-b1')
    expect( result ).toEqual( expected )
  })
  it("Test Sidebar._removeBackdrop function", function() {
    Sidebar.prototype._backdrop = { parentNode: { removeChild: function(){} } }
    Sidebar.prototype._removeBackdrop() 
    expect( Sidebar.prototype._backdrop ).toBe( null )
  })
  it("Test Sidebar._showBackdrop function", function() {
    let result = document.getElementsByClassName('c-sidebar-backdrop')
    if(result.length > 0){
        result = true
    }else{
        result = false
    }
    expect( result ).toBe( false )
    Sidebar.prototype._showBackdrop() 
    result = document.getElementsByClassName('c-sidebar-backdrop')
    if(result.length > 0){
        result = true
    }else{
        result = false
    }
    expect( result ).toBe( true )
  })
  /*
  it("Test Sidebar._toggleDropdown function", function() {
    document.body.innerHTML += `
      <ul class="c-sidebar-nav" id="sidebar-ele-4">
        <li class="c-sidebar-nav-dropdown c-show">
          <a class="c-sidebar-nav-dropdown-toggle" id="dropdown-click-1"></a>
          <ul class="c-sidebar-nav-dropdown-items">
            <li class="c-sidebar-nav-item">Lorem</li>
            <li class="c-sidebar-nav-item">Ipsum</li>
          </ul>
        </li>
        <li class="c-sidebar-nav-dropdown c-show">
        </li>
      </ul>
    `
    let elements = document.getElementsByClassName('c-sidebar-nav-dropdown')
    let result = true
    for(let i = 0; i<elements.length; i++){
      if(!elements[i].classList.contains('c-show')){
        result = false
      }
    }
    expect(result).toBe(true)
    const element = document.getElementById('dropdown-click-1')
    //let sidebar = new Sidebar(document.getElementById('sidebar-ele-4'))
    //element.addEventListener('click', Sidebar.prototype._toggleDropdown )
    element.addEventListener('click', Sidebar.prototype._toggleDropdown )
    element.dispatchEvent(new Event('click'))

    elements = document.getElementsByClassName('c-sidebar-nav-dropdown');
    result = true
    let counter = 0
    for(let i = 0; i<elements.length; i++){
      if(elements[i].classList.contains('c-show')){
        counter++
      }
    }
    if(counter>1){
      result = false
    }
    expect(result).toBe(true)
  })
  */
/*
  it("Test Sidebar._makeScrollbar function", function() {
    let expected = {}
    let result = Sidebar.prototype._makeScrollbar()  
    expect(result).toEqual(expected)
  })
*/
  it("Test Sidebar._setActiveLink function", function() {
    document.body.innerHTML += `
      <ul class="c-sidebar-nav" id="sb-c1">
        <li class="c-sidebar-nav-dropdown c-show">
          <a class="c-sidebar-nav-dropdown-toggle"></a>
          <ul class="c-sidebar-nav-dropdown-items">
            <li class="c-sidebar-nav-item">
              <a class="c-sidebar-nav-link sb-c2" id="sb-c2" href="/context.html"></a>
            </li>
            <li class="c-sidebar-nav-item">
              <a class="c-sidebar-nav-link" href="/no-context.html"></a>
            </li>
          </ul>
        </li>
      </ul>
    `
    let elements = document.getElementsByClassName('c-sidebar-nav-link')
    let result = true
    for(let i = 0; i<elements.length; i++){
      if(elements[i].classList.contains('sb-c2')){
        if(!elements[i].classList.contains('c-active')){
          result = false
          break
        }
      }else{
        if(elements[i].classList.contains('c-active')){
          result = false
          break
        }
      }
    }
    expect(result).toBe(false)
    let sidebar = new Sidebar(document.getElementById('sb-c1'))
    sidebar._setActiveLink() 
    elements = document.getElementsByClassName('c-sidebar-nav-link')
    result = true
    for(let i = 0; i<elements.length; i++){
      if(elements[i].classList.contains('sb-c2')){
        if(!elements[i].classList.contains('c-active')){
          result = false
          break
        }
      }else{
        if(elements[i].classList.contains('c-active')){
          result = false
          break
        }
      }
    }
    expect(result).toBe(true)
  })
 /*
  it("Test Sidebar._isMobile function", function() {
    document.body.innerHTML += `
    <div id="sb-d1" style="--is-mobile:true;"></div>
    <div id="sb-d2" style="--is-mobile:false;"></div>`
    let element = document.getElementById('sb-d1')
    element.addEventListener('click', Sidebar.prototype._isMobile )
    element.dispatchEvent(new Event('click'))  
    expect(result).toEqual(true)
    element = document.getElementById('sb-d2')
    element.addEventListener('click', Sidebar.prototype._isMobile )
    element.dispatchEvent(new Event('click'))
    result = Sidebar.prototype._isMobile()  
    expect(result).toEqual(false)

  })
*/

  it("Test Sidebar._setData and Sidebar._getData functions", function(){
    document.body.innerHTML += `
    <div id="sb-e1"></div>`
    let element = document.getElementById('sb-e1')
    Sidebar.prototype._setData(element, 'key', 'someData')
    let result = Sidebar.prototype._getData(element, 'key')
    expect( result ).toBe( 'someData' )
  })

  it("Test Sidebar._sidebarInterface function", function() {
    document.body.innerHTML += `
    <div id="sb-f1"></div>`
    let element = document.getElementById('sb-f1')
    Sidebar.prototype._setData(element, 'coreui.sidebar', {lorem: function(){ return 'Lorem ipsum' } })
    Sidebar.prototype.constructor._sidebarInterface(element, 'lorem')
    expect( true ).toBe( true );
  })


})
