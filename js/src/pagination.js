/**
 * --------------------------------------------------------------------------
 * CoreUI (v3.?): pagination.js
 * Licensed under MIT (https://coreui.io/license)
 * --------------------------------------------------------------------------
 */

import {
  getjQuery,
  getElementFromSelector,
  typeCheckConfig,
  objStr,
  findRep
} from './util/index'
import Data from './dom/data'
import EventHandler from './dom/event-handler'
import Manipulator from './dom/manipulator'
import SelectorEngine from './dom/selector-engine'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'pagination' //zmienna
const VERSION = '3.2.2'
const DATA_KEY = 'coreui.pagination'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

// zmienne
const SELECTOR_COMPONENT = '[coreui-pagination]'

const SELECTOR_LIST = '[data-list]'
const SELECTOR_INPUT = 'input'
const SELECTOR_TAGS = '.c-tag-area'
const SELECTOR_TAG_DEL = '.c-tag button'

const EVENT_OPEN = `open${EVENT_KEY}`
const EVENT_CLOSE = `close${EVENT_KEY}`
const EVENT_SEARCH = `search${EVENT_KEY}`
const EVENT_FOCUS = `focus${EVENT_KEY}`
const EVENT_BLUR = `blur${EVENT_KEY}`
const EVENT_CHANGE = `keyup${EVENT_KEY}`
const EVENT_CLICK = `click${EVENT_KEY}`

const TAG_LIST = 'UL'
const TAG_ITEM = 'LI'

const CLASSNAME_MULTI_SELECT = 'c-select'
const CLASSNAME_TAG = 'c-tag'
const CLASSNAME_LABEL = 'c-label'

//jquery
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`

const DefaultType = {
  activePage: 'number',
  pages: 'number',
  size: 'string',
  align: 'string',
  limit: 'number',
  dots: 'boolean',
  arrows: 'boolean',
  doubleArrows: 'boolean',
}

const Default = {
  activePage: 1,
  pages: 10,
  align: 'start',
  limit: 5,
  dots: true,
  arrows: true,
  doubleArrows: true,
}


/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Pagination {
  constructor(element, config) {

    //alert('template');

    /*

    Dropdown

    this._element = element
    this._popper = null
    this._config = this._getConfig(config)
    this._menu = this._getMenuElement()
    this._inNavbar = this._detectNavbar()
    this._inHeader = this._detectHeader()

    this._addEventListeners()
    Data.setData(element, DATA_KEY, this)

    */

    //check if exist

    if (Data.getData(element, DATA_KEY)) { // already found
      console.warn('Instance already exist.');
      return;
    }

    this._element = element

    this._options = {} //?

    //saving props

    this._config = this._getConfig(config);
    console.log('config', this._config);

    for (let key in this._config)
      this['_'+key] = this._config[key];


    this._props = {...this._config};

    //data
    //zapisanie elementu do data
    //if (this._element)
    {
      Data.setData(element, DATA_KEY, this)
    }

    /*
    SelectorEngine.findOne -
    SelectorEngine.children -
    */


    // render

    // template
    /*
    this._template = `

    `
    */

    //data

    let data = (()=>{
    return {
    }
    })()
    for (let key in data)
      this['_'+key] = data[key];

    // first render

    this._render();


    return;

    /*

    //list
    this._elementList = SelectorEngine.findOne(SELECTOR_LIST, element);
    if (this._elementList) {
      this._elementList.style.display = 'none';
    }


    //set init values ?
    this._getNames();

    this._config.selected.map(val=>{
      this._options[val] = this._names[val];
    });

    //input
    this._elementInput = SelectorEngine.findOne(SELECTOR_INPUT, element);

    //tags
    this._elementTags = SelectorEngine.findOne(SELECTOR_TAGS, element);

    */

  }


  // Getters ?

  static get VERSION() {
    return VERSION
  }

  static get Default() {
    return Default
  }

  static get DefaultType() {
    return DefaultType
  }

  // Private

  _render(){

    const htmlRep = (code, tPar)=>{
      let start = 0;
      let max = 100;
      let n = 0;
      while(true){
        let run = findRep(code, start);
        if (run===null) break;
        let replaceCode = '';
        if (run[0][0]===':')
          replaceCode = tPar[run[0].substr(1)];
        else if(run[0][0]==='/')
          replaceCode = '{'+run[0].substr(1)+'}';
        else
          replaceCode = replace[run[0]](tPar);
        if (replaceCode===undefined) replaceCode = '';
        code = code.substr(0, run[1]) + replaceCode + code.substr(run[2]+1);
        n++;
        if (n==max) break;
        start = run[1]+replaceCode.length;
      }
      return code;
    }

    //

    // template, this.template

    /*
    this.a = 6;
    this.a1 = 8;
    this.b = 4;
    this.tablica = [1,4,5];
    this.columnFilterState = [];

    this._global = {
      icons:{
        cilFilterX:1
      }
    }
    */

    //***

        let replace = {};
        if (this._pages!==this._old_pages) ( (val)=> {
            if (val && val < this._activePage) {
              this._emitEvent('update:activePage', val, true)
            }
          })(this._pages);
    	this._old_pages = this._pages;


        this._backArrowsClasses = ( ()=> {
            return ['page-item', { 'disabled': this._activePage === 1 }]
        })();

    	this._nextArrowsClasses = ( ()=> {
          return ['page-item', { 'disabled': this._activePage === this._pages }]
        })();

    	this._computedClasses = ( ()=> {
          const sizeClass = this._size ? `pagination-${this._size}` : ''
          return `pagination ${sizeClass} justify-content-${this._align}`
        })();

    	this._showDots = ( ()=> {
          return this._dots && this._limit > 4 && this._limit < this._pages
        })();

    	this._maxPrevItems = ( ()=> {
          return Math.floor((this._limit - 1) / 2)
        })();

    	this._maxNextItems = ( ()=> {
          return Math.ceil((this._limit - 1) / 2)
        })();

    	this._beforeDots = ( ()=> {
          return this._showDots && this._activePage > this._maxPrevItems + 1
        })();

    	this._afterDots = ( ()=> {
          return this._showDots && this._activePage < this._pages - this._maxNextItems
        })();

    	this._computedLimit = ( ()=> {
          return this._limit - this._afterDots - this._beforeDots
        })();

    	this._range = ( ()=> {
          return this._activePage + this._maxNextItems
        })();

    	this._lastItem = ( ()=> {
          return this._range >= this._pages ? this._pages : this._range - this._afterDots
        })();

    	this._itemsAmount = ( ()=> {
          return this._pages < this._computedLimit ? this._pages : this._computedLimit
        })();

    	this._items = ( ()=> {
          if (this._activePage - this._maxPrevItems <= 1 ) {
            return Array.from({ length: this._itemsAmount }, (v, i) => i + 1 )
          } else {
            return Array.from({length: this._itemsAmount}, (v, i) => {
              return this._lastItem - i
            }).reverse()
          }
        })();



    replace['exp-1'] =
            (par)=>{return htmlRep(objStr(this._computedClasses), par)};

    replace['exp-2'] =
            (par)=>{return htmlRep(objStr(this._backArrowsClasses), par)};

     replace['eve-1'] =
            (par)=>{
              eventN++;
              handlers[eventN] = {
                eventType: 'click',
                f: (event)=>{
                  event.preventDefault();
                  event.stopPropagation();
                  this._setPage(1);
                }
              }
              return 'coreui-event="'+eventN+'"';
            };

     replace['exp-3'] =
            (par)=>{return htmlRep(objStr(this._activePage === 1), par)};

     replace['exp-4'] =
            (par)=>{return htmlRep(objStr(this._activePage === 1), par)};

    replace['first-button-1'] =
            (par)=>{
              if (this._firstButton && typeof this._firstButton === 'function') return htmlRep(objStr(this._firstButton()), par);
              else if (this._firstButton) return htmlRep(objStr(this._firstButton), par);
              else return htmlRep(`
              &laquo;
              `, par);
            };

     replace['double-arrows-1'] =
            (par)=>{
              if (this._doubleArrows) return htmlRep(`
          <li class="{exp-2}">
            <a
              href="#self"
              class="page-link"
              {eve-1}
              disabled="{exp-3}"
              aria-label="Go to first page"
              aria-disabled="{exp-4}"
            >
              {first-button-1}
            </a>
          </li>
          `, par)
              else return ''
            };

     replace['exp-5'] =
            (par)=>{return htmlRep(objStr(this._backArrowsClasses), par)};

     replace['eve-2'] =
            (par)=>{
              eventN++;
              handlers[eventN] = {
                eventType: 'click',
                f: (event)=>{
                  event.preventDefault();
                  event.stopPropagation();
                  this._setPage(this._activePage - 1);
                }
              }
              return 'coreui-event="'+eventN+'"';
            };

     replace['exp-6'] =
            (par)=>{return htmlRep(objStr(this._activePage === 1), par)};

     replace['exp-7'] =
            (par)=>{return htmlRep(objStr(this._activePage === 1), par)};

     replace['previous-button-1'] =
            (par)=>{
              if (this._previousButton && typeof this._previousButton === 'function') return htmlRep(objStr(this._previousButton()), par);
              else if (this._previousButton) return htmlRep(objStr(this._previousButton), par);
              else return htmlRep(`
              &lsaquo;
              `, par);
            };

     replace['arrows-1'] =
            (par)=>{
              if (this._arrows) return htmlRep(`
          <li class="{exp-5}">
            <a
              href="#self"
              class="page-link"
              {eve-2}
              disabled="{exp-6}"
              aria-label="Go to previous page"
              aria-disabled="{exp-7}"
            >
              {previous-button-1}
            </a>
          </li>
          `, par)
              else return ''
            };

    replace['before-dots-1'] =
            (par)=>{
              if (this._beforeDots) return htmlRep(`
          <li
            role="separator"
            class="page-item disabled"
          >
            <span class="page-link">…</span>
          </li>
          `, par)
              else return ''
            };

    replace['exp-8'] =
            (par)=>{return htmlRep(objStr([{'active': this._activePage === par["item"] }, 'page-item']), par)};

     replace['eve-3'] =
            (par)=>{
              eventN++;
              handlers[eventN] = {
                eventType: 'click',
                f: (event)=>{
                  event.preventDefault();
                  event.stopPropagation();
                  this._setPage(par["item"], event);
                }
              }
              return 'coreui-event="'+eventN+'"';
            };

     replace['exp-9'] =
            (par)=>{return htmlRep(objStr(this._activePage === par["item"] ? `Current page par["item"]` : `Go to page par["item"]`), par)};

     replace['items-1'] =
            (par)=>{
              let code = '';
              for (let idx in this._items){
                let value = this._items[idx];
                par['key'] = idx;
                par['item'] = value;
                code+=htmlRep(`
          <li
            key="{:item}"
            class="{exp-8}"
          >
            <a
              href="#self"
              class="page-link c-page-link-number"
              {eve-3}
              aria-label="{exp-9}"
            >
              {:item}
            </a>
          </li>
          `, par);
              }
              return code;
            };

     replace['after-dots-1'] =
            (par)=>{
              if (this._afterDots) return htmlRep(`
          <li
            role="separator"
            class="page-item disabled"
          >
            <span class="page-link">…</span>
          </li>
          `, par)
              else return ''
            };

     replace['exp-10'] =
            (par)=>{return htmlRep(objStr(this._nextArrowsClasses), par)};

    replace['eve-4'] =
            (par)=>{
              eventN++;
              handlers[eventN] = {
                eventType: 'click',
                f: (event)=>{
                  event.preventDefault();
                  event.stopPropagation();
                  this._setPage(this._activePage + 1);
                }
              }
              return 'coreui-event="'+eventN+'"';
            };

     replace['exp-11'] =
            (par)=>{return htmlRep(objStr(this._activePage === this._pages), par)};

     replace['exp-12'] =
            (par)=>{return htmlRep(objStr(this._activePage === this._pages), par)};

    replace['next-button-1'] =
            (par)=>{
              if (this._nextButton && typeof this._nextButton === 'function') return htmlRep(objStr(this._nextButton()), par);
              else if (this._nextButton) return htmlRep(objStr(this._nextButton), par);
              else return htmlRep(`
              &rsaquo;
              `, par);
            };

     replace['arrows-2-1'] =
            (par)=>{
              if (this._arrows) return htmlRep(`
          <li
            class="{exp-10}"
          >
            <a
              href="#self"
              class="page-link"
              {eve-4}
              disabled="{exp-11}"
              aria-label="Go to next page"
              aria-disabled="{exp-12}"
            >
              {next-button-1}
            </a>
          </li>
          `, par)
              else return ''
            };

     replace['exp-13'] =
            (par)=>{return htmlRep(objStr(this._nextArrowsClasses), par)};

     replace['eve-5'] =
            (par)=>{
              eventN++;
              handlers[eventN] = {
                eventType: 'click',
                f: (event)=>{
                  event.preventDefault();
                  event.stopPropagation();
                  return (event)=>this._setPage(this._pages);
                }
              }
              return 'coreui-event="'+eventN+'"';
            };

     replace['exp-14'] =
            (par)=>{return htmlRep(objStr(this._activePage === this._pages), par)};

    replace['exp-15'] =
            (par)=>{return htmlRep(objStr(this._activePage === this._pages), par)};

     replace['last-button-1'] =
            (par)=>{
              if (this._lastButton && typeof this._lastButton === 'function') return htmlRep(objStr(this._lastButton()), par);
              else if (this._lastButton) return htmlRep(objStr(this._lastButton), par);
              else return htmlRep(`
              &raquo;
              `, par);
            };

    replace['double-arrows-2-1'] =
            (par)=>{
              if (this._doubleArrows) return htmlRep(`
          <li class="{exp-13}">
            <a
              href="#self"
              class="page-link"
              {eve-5}
              disabled="{exp-14}"
              aria-label="Go to last page"
              aria-disabled="{exp-15}"
            >
              {last-button-1}
            </a>
          </li>
          `, par)
              else return ''
            };

    this._template = `
      <nav aria-label="pagination">
        <ul class="{exp-1}">
          {double-arrows-1}
          {arrows-1}
          {before-dots-1}
          {items-1}
          {after-dots-1}
          {arrows-2-1}
          {double-arrows-2-1}
        </ul>
      </nav>
    `;

    // build

    let handlers = {};
    let comps = {};
    let eventN = 0;
    let compN = 0;

    let code = htmlRep(this._template, {});
    //console.log('code:');
    //console.log(code);

    //insert code
    this._element.innerHTML = code;

    let el;

    //events
    for (let id in handlers){
      el = SelectorEngine.findOne('[coreui-event="'+id+'"]', this._element);
      EventHandler.on(el, handlers[id].eventType+EVENT_KEY, handlers[id].f);
    }

    setTimeout(()=>{
      this._rendered();
    }, 1);

  }

  _rendered(){ // run after content is rendered
  }

  // methods

  _setPage(number, e = null) {
    if (number === this._activePage) {
      return
    }
    this._emitEvent('update:activePage', number, false)
    if (e) {
      this._changeFocus(e)
    }
  }

  _changeFocus(e) {
    const items = this._element.getElementsByClassName('c-page-link-number')
    const focused = Number(e.target.innerHTML)
    this._next(() => {
      for (let i = 0; i < items.length; i++) {
        if (Number(items[i].innerHTML) === focused) {
          items[i].focus()
        }
      }
    })
  }

  //

  _next(f){
    setTimeout(f,1);
  }

  _emitEvent(type, value, element=document) { //c
    switch(type){
      case 'update:activePage':
      this._render();
      break;
    }
    return EventHandler.trigger(element, type, value);
  }


  _addEventListeners() {
    EventHandler.on(this._elementInput, EVENT_FOCUS, event => {
      event.preventDefault();
      event.stopPropagation();
      this._onSearchFocus(this._elementInput);
    })
    EventHandler.on(this._elementInput, EVENT_BLUR, event => {
      event.preventDefault();
      event.stopPropagation();
      //this._onSearchFocusOut(this._elementInput);
    })
    EventHandler.on(this._elementInput, EVENT_CHANGE, event => {
      event.preventDefault();
      event.stopPropagation();
      this._onSearchChange(this._elementInput);
    })
    EventHandler.on(this._elementList, EVENT_CLICK, event => {
      event.preventDefault();
      event.stopPropagation();
      this._onListClick(event.target);
    })
  }

  _addTagsEventListeners() {
    EventHandler.on(document, EVENT_CLICK, SELECTOR_TAG_DEL, event => {
      event.preventDefault();
      event.stopPropagation();
      this._onTagDelClick(event.target);
    })
  }

  //user event triggers

  _triggerOpenEvent(element) {
    return EventHandler.trigger(element, EVENT_OPEN)
  }

  _triggerCloseEvent(element) {
    return EventHandler.trigger(element, EVENT_CLOSE)
  }

  _triggerSearchEvent(element) {
    return EventHandler.trigger(element, EVENT_SEARCH)
  }


  // config

  _getConfig(config, update) {
    if (update !== true)
      config = {
        ...this.constructor.Default,
        ...Manipulator.getDataAttributes(this._element),
        ...config
      }

    /*
    typeCheckConfig(
      NAME,
      config,
      this.constructor.DefaultType
    )
    */

    return config
  }


  // actions

  _open(element) {
    if (element)
      element.style.display = 'initial';
  }

  _close(element) {
    if (element)
      element.style.display = 'none';
  }

  //list

  _onListClick(element) {
    if (element.tagName!==TAG_ITEM || element.classList.contains(CLASSNAME_LABEL))
      return;
    const val = element.value || element.textContent;
    if (this._options[val]===undefined) {
      this._options[val] = element.textContent;
      this._updateTags();
    }
  }

  //search

  _onSearchFocus(element) {
    this.open();
  }

  _onSearchFocusOut(element) {
    this.close();
  }

  _onSearchChange(element) {
    if (element)
      this.search(element.value);
  }

  _updateList(element) {
    if (!element)
      return;
    const nodes = SelectorEngine.children(element, TAG_LIST+','+TAG_ITEM);
    nodes.map((node)=>{
      if (node.tagName===TAG_LIST) {
        this._updateList(node);
        return;
      }
      if (node.tagName!==TAG_ITEM || node.classList.contains(CLASSNAME_LABEL))
        return;
      if (node.textContent.indexOf(this._search)===-1)
        node.style.display='none';
      else
        node.style.display='block';
    })
  }

  _getNames(element) {
    if (!element)
      return;
    const nodes = SelectorEngine.children(element, TAG_LIST+','+TAG_ITEM);
    nodes.map((node)=>{
      if (node.tagName===TAG_LIST) {
        this._getNames(node);
        return;
      }
      if (node.tagName!==TAG_ITEM || node.classList.contains(CLASSNAME_LABEL))
        return;
      this._names[node.value || node.textContent] = node.textContent;
    })
  }

  // tags

  _updateTags(element) {
    if (!this._elementTags)
      return;
    let tag;
    this._elementTags.innerHTML = '';
    for (let val in this._options) {
      tag = Manipulator.createElementFromHTML('\
      <div class="'+CLASSNAME_TAG+'">'+this._options[val]+'\
        <button class="btn btn-default" value="'+val+'">&times;</button>\
      </div>');
      this._elementTags.append(tag);
    }
    this._addTagsEventListeners();
  }

  _onTagDelClick(element) {
    if (!element)
      return;
    const val = element.value;
    if (val!==undefined) {
      delete this._options[val];
      this._updateTags();
    }
  }


  // Public

  open(element) {
    let rootElement = this._elementList

    const customEvent = this._triggerOpenEvent(rootElement);

    if (customEvent === null || customEvent.defaultPrevented) {
      return
    }

    this._open(rootElement)
  }

  close(element) {
    let rootElement = this._elementList

    const customEvent = this._triggerCloseEvent(rootElement);

    if (customEvent === null || customEvent.defaultPrevented) {
      return
    }

    this._close(rootElement)
  }

  search(text) {
    let rootElement = this._elementList
    const customEvent = this._triggerSearchEvent(rootElement);

    if (customEvent === null || customEvent.defaultPrevented) {
      return
    }

    this._search = text;
    this._updateList(rootElement)
  }

  value() {
    return Object.keys(this._options);
  }


  // Static
  /*
  po uzyciu jquery
  stworzenie nowego obiektu
  zapisanie obirktu do data
  */

  static jQueryInterface(config) {
    return this.each(function () {

      let data = Data.getData(this, DATA_KEY)

      if (!data) {
        data = new Pagination(this)
      }

      switch (config){
        case 'update':
        data[config](this, par)
        break;
        case 'dispose':
        case 'open':
        case 'close':
        case 'search':
        case 'value':
        data[config](this)
        break;
      }

    })
  }

  static getInstance(element) {
    return Data.getData(element, DATA_KEY)
  }


  // API 2.0 (experimental)

  // functions available for dom element

  update(config) { // public method
    this._getConfig(config);
    this._render();
  }

  dispose() {
    Data.removeData(this._element, DATA_KEY)
    this._element = null
  }

  static new(element, config) {
    let data = Data.getData(element, DATA_KEY)
    if (!data) {
      return new Pagination(element, config);
    }
    return data;
  }

  static destroy(element) { // remove instance connected to element
    let data = Data.getData(element, DATA_KEY)
    if (data) {
      if (element.parentNode) {
        element.parentNode.removeChild(element)
      }
      Pagination.destroyInstance(data);
      Data.removeData(element, DATA_KEY);
      return true;
    }
    return false;
  }

}


/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

//stworzenie dla kazdego elementu odpowiedniej klasy SELECTOR_COMPONENT

 EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
   // eslint-disable-next-line unicorn/prefer-spread
   /*Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
     Sidebar._sidebarInterface(element)
   })*/
 })

const $ = getjQuery()

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .pagination to jQuery only if jQuery is present
 */

/* istanbul ignore if */
if ($) {
  const JQUERY_NO_CONFLICT = $.fn[NAME]
  $.fn[NAME] = Pagination.jQueryInterface
  $.fn[NAME].Constructor = Pagination
  $.fn[NAME].noConflict = () => {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Pagination.jQueryInterface
  }
}

export default Pagination
