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
const SELECTOR_COMPONENT = '[data-coreui="pagination"]'

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
  //
  size: ''
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
    //console.log('config', this._config);

    //data
    //zapisanie elementu do data
    if (this._element){
      Data.setData(element, DATA_KEY, this)
    }


    //data

    let data = (()=>{
    return {
    }
    })()
    for (let key in data)
      this['_'+key] = data[key];


    // init

    this._codes = [];


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

    const htmlRepStr = (code, tPar)=>htmlRep(objStr(code), tPar)

    const getValue = (val, pars, par, html)=>{
      if (val && typeof val === 'function') return htmlRepStr(val(pars), par);
      else if (val) return htmlRepStr(val, par);
      else return htmlRep(html, par);
    }

    //

    // template, this.template

    //alert('pagination render');


    //***


    let replace = {};
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


    if (this._pages!==this._old_pages) ( (val)=> {
        if (val && val < this._activePage) {
          this._emitEvent('update:activePage', {val, auto:true})
        }
      })(this._pages, this._old_pages);
	this._old_pages = this._pages;



 		replace['last-click'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'click',
            f: (event)=>this._onLastClick(event, par)
          }
          return 'coreui-event-click="'+eventN+'"';
        };

		replace['next-click'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'click',
            f: (event)=>this._onNextClick(event, par)
          }
          return 'coreui-event-click="'+eventN+'"';
        };

		replace['set-click'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'click',
            f: (event)=>this._onSetClick(event, par)
          }
          return 'coreui-event-click="'+eventN+'"';
        };

 		replace['previous-click'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'click',
            f: (event)=>this._onPreviousClick(event, par)
          }
          return 'coreui-event-click="'+eventN+'"';
        };

 		replace['first-click'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'click',
            f: (event)=>this._onFirstClick(event, par)
          }
          return 'coreui-event-click="'+eventN+'"';
        };

 		replace['classes'] =
        (par)=>{return htmlRepStr(this._computedClasses, par)};

 		replace['back-classes'] =
        (par)=>{return htmlRepStr(this._backArrowsClasses, par)};

 		replace['active-page'] =
        (par)=>{return htmlRepStr(this._activePage === 1, par)};

 		replace['active-page-2'] =
        (par)=>{return htmlRepStr(this._activePage === 1, par)};

 		replace['first-button'] =
          (par)=>getValue(this._firstButton, null, par, `
          &laquo;
          `);

 		replace['double-arrows'] =
        (par)=>{
          if (this._doubleArrows) return htmlRep(`
      <li class="{back-classes}">
        <a
          href="#self"
          class="page-link"
          {first-click}
          disabled="{active-page}"
          aria-label="Go to first page"
          aria-disabled="{active-page-2}"
        >
          {first-button}
        </a>
      </li>
      `, par);
          return ''
        };

 		replace['cack-classes'] =
        (par)=>{return htmlRepStr(this._backArrowsClasses, par)};

 		replace['active-page-3'] =
        (par)=>{return htmlRepStr(this._activePage === 1, par)};

 		replace['active-page-4'] =
        (par)=>{return htmlRepStr(this._activePage === 1, par)};

		replace['previous-button'] =
          (par)=>getValue(this._previousButton, null, par, `
          &lsaquo;
          `);

 		replace['arrows'] =
        (par)=>{
          if (this._arrows) return htmlRep(`
      <li class="{cack-classes}">
        <a
          href="#self"
          class="page-link"
          {previous-click}
          disabled="{active-page-3}"
          aria-label="Go to previous page"
          aria-disabled="{active-page-4}"
        >
          {previous-button}
        </a>
      </li>
      `, par);
          return ''
        };

 		replace['before-dots'] =
        (par)=>{
          if (this._beforeDots) return htmlRep(`
      <li
        role="separator"
        class="page-item disabled"
      >
        <span class="page-link">…</span>
      </li>
      `, par);
          return ''
        };

 		replace['classes-2'] =
        (par)=>{return htmlRepStr([{'active': this._activePage === par["item"] }, 'page-item'], par)};

		replace['exp'] =
        (par)=>{return htmlRepStr(this._activePage === par["item"] ? `Current page par["item"]` : `Go to page par["item"]`, par)};

 		replace['items'] =
        (par)=>{
          let code = '';
          for (let idx in this._items){
            par['key'] = idx;
            par['item'] = this._items[idx];
            code+=htmlRep(`
      <li
        key="{:item}"
        class="{classes-2}"
      >
        <a
          href="#self"
          class="page-link c-page-link-number"
          {set-click}
          aria-label="as label {exp}"
        >
          {:item}
        </a>
      </li>
      `, {...par});
          }
          return code;
        };

 		replace['after-dots'] =
        (par)=>{
          if (this._afterDots) return htmlRep(`
      <li
        role="separator"
        class="page-item disabled"
      >
        <span class="page-link">…</span>
      </li>
      `, par);
          return ''
        };

 		replace['next-classes'] =
        (par)=>{return htmlRepStr(this._nextArrowsClasses, par)};

 		replace['active-page-5'] =
        (par)=>{return htmlRepStr(this._activePage === this._pages, par)};

 		replace['active-page-6'] =
        (par)=>{return htmlRepStr(this._activePage === this._pages, par)};

 		replace['next-button'] =
          (par)=>getValue(this._nextButton, null, par, `
          &rsaquo;
          `);

 		replace['arrows-2'] =
        (par)=>{
          if (this._arrows) return htmlRep(`
      <li
        class="{next-classes}"
      >
        <a
          href="#self"
          class="page-link"
          {next-click}
          disabled="{active-page-5}"
          aria-label="Go to next page"
          aria-disabled="{active-page-6}"
        >
          {next-button}
        </a>
      </li>
      `, par);
          return ''
        };

		replace['next-classes-2'] =
        (par)=>{return htmlRepStr(this._nextArrowsClasses, par)};

		replace['active-page-7'] =
        (par)=>{return htmlRepStr(this._activePage === this._pages, par)};

 		replace['active-page-8'] =
        (par)=>{return htmlRepStr(this._activePage === this._pages, par)};

 		replace['last-button'] =
          (par)=>getValue(this._lastButton, null, par, `
          &raquo;
          `);

 		replace['double-arrows-2'] =
        (par)=>{
          if (this._doubleArrows) return htmlRep(`
      <li class="{next-classes-2}">
        <a
          href="#self"
          class="page-link"
          {last-click}
          disabled="{active-page-7}"
          aria-label="Go to last page"
          aria-disabled="{active-page-8}"
        >
          {last-button}
        </a>
      </li>
      `, par);
          return ''
        };


    this._template = `
      <nav aria-label="pagination">
        <ul class="{classes}">
          {double-arrows}
          {arrows}
          {before-dots}
          {items}
          {after-dots}
          {arrows-2}
          {double-arrows-2}
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

    let el;

    if (code!==this._codes['main']){
      //insert main code
      this._element.innerHTML = code;
      this._codes = [];
      this._codes['main'] = code;

      //events
      for (let id in handlers){
        el = SelectorEngine.findOne('[coreui-event-'+handlers[id].eventType+'="'+id+'"]', this._element);
        EventHandler.on(el, handlers[id].eventType+EVENT_KEY, handlers[id].f);
      }

      //components
      for (let id in comps){
        el = SelectorEngine.findOne('[coreui-comp="'+id+'"]', this._element);
        // init
        let component = new coreui[comps[id].compType](el, comps[id].props);
      }
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
    this._emitEvent('update:activePage', {number, auto:false})
    if (e) {
      this._changeFocus(e)
    }
    if (this._onChange)
      this._onChange(number);
    this._render();
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
    //console.log('emit', type, value);
    switch(type){
      case 'update:activePage':
      //this._render();
      break;
    }
    return EventHandler.trigger(element, type, value);
  }

  _onFirstClick(event, par) {
  	this._setPage(1);
  	event.preventDefault();
  	event.stopPropagation();
  }

  _onPreviousClick(event, par) {
  	this._setPage(this._activePage - 1);
  	event.preventDefault();
  	event.stopPropagation();
  }

  _onSetClick(event, par) {
  	this._setPage(par["item"], event);
  	event.preventDefault();
  	event.stopPropagation();
  }

  _onNextClick(event, par) {
  	this._setPage(this._activePage + 1);
  	event.preventDefault();
  	event.stopPropagation();
  }

  _onLastClick(event, par) {
  	return (event)=>this._setPage(this._pages);
  	event.preventDefault();
  	event.stopPropagation();
  }


  // config

  _getConfig(config, update) {
    if (update !== true)
      config = {
        ...this.constructor.Default,
        ...Manipulator.getDataAttributes(this._element),
        ...config
      }

    for (let key in config)
      this['_'+key] = config[key];

    typeCheckConfig(
      NAME,
      config,
      this.constructor.DefaultType
    )


    return config
  }


  // Public

  value() {
    return Object.keys(this._options);
  }


  // Static

  static paginationInterface(element, config, par) {
    let data = Data.getData(element, DATA_KEY)
    if (!data) {
      data = typeof config === 'object' ? new Pagination(element, config) : new Pagination(element)
    }

    if (typeof config === 'string') {
      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`)
      }

      switch (config){
        case 'update':
        data[config](par)
        break;
        case 'dispose':
        case 'value':
        data[config]()
        break;
      }
    }
  }

  static jQueryInterface(config, par) {
    return this.each(function () {
      Pagination.paginationInterface(this, config, par);
      /*
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
      */
    })
  }

  static getInstance(element) {
    return Data.getData(element, DATA_KEY)
  }


  // API 2.0 (experimental)

  // functions available for dom element

  render() {
    this._render();
  }

  update(config) {
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
   Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
     Pagination.paginationInterface(element, Manipulator.getDataAttributes(element))
   })
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
