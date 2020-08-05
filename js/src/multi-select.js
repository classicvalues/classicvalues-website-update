/**
 * --------------------------------------------------------------------------
 * CoreUI (v3.?): multi-select.js
 * Licensed under MIT (https://coreui.io/license)
 * --------------------------------------------------------------------------
 */

import {
  getjQuery,
  getElementFromSelector,
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

const NAME = 'multiselect'
const VERSION = '3.2.2'
const DATA_KEY = 'coreui.multiselect'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const SELECTOR_LIST = '[data-list="true"]'
const SELECTOR_INPUT = '[data-input="true"]'
const SELECTOR_TAGS = '.c-tag-area'
const SELECTOR_TAG_DEL = '.c-tag button'

const EVENT_OPEN = `open${EVENT_KEY}`
const EVENT_CLOSE = `close${EVENT_KEY}`
const EVENT_SEARCH = `search${EVENT_KEY}`
const EVENT_FOCUS = `focus${EVENT_KEY}`
const EVENT_BLUR = `blur${EVENT_KEY}`
const EVENT_CHANGE = `keyup${EVENT_KEY}`
const EVENT_CLICK = `click${EVENT_KEY}`

const CLASSNAME_MULTI_SELECT = 'c-select'


/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class MultiSelect {
  constructor(element) {
    this._element = element

    //data
    if (this._element) {
      Data.setData(element, DATA_KEY, this)
    }

    //selected options
    this._options = {};

    //list
    this._elementList = SelectorEngine.findOne(SELECTOR_LIST, element);
    if (this._elementList) {
      this._elementList.style.display = 'none';
    }

    //input
    this._elementInput = SelectorEngine.findOne(SELECTOR_INPUT, element);

    //tags
    this._elementTags = SelectorEngine.findOne(SELECTOR_TAGS, element);

    //events
    this._addEventListeners();
  }


  // Getters

  static get VERSION() {
    return VERSION
  }

  static get Default() {
    return Default
  }

  static get DefaultType() {
    return DefaultType
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

  //default

  dispose() {
    Data.removeData(this._element, DATA_KEY)
    this._element = null
  }


  // Private

  _getConfig(config, update) {
    if (update !== true)
      config = {
        ...this.constructor.Default,
        ...Manipulator.getDataAttributes(this._element),
        ...config
      }

    typeCheckConfig(
      NAME,
      config,
      this.constructor.DefaultType
    )

    return config
  }

  // events

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
    this.search(element.value);
  }

  _updateList(element) {
    const nodes = SelectorEngine.children(element, 'li, ul');
    nodes.map((node)=>{
      if (node.tagName==='UL') {
        this._updateList(node);
        return;
      }
      if (node.tagName!=='LI')
        return;
      if (node.classList.contains('c-label'))
        return;
      if (node.textContent.indexOf(this._search)===-1)
        node.style.display='none';
      else
        node.style.display='block';
    })
  }

  // tags

  _updateTags(element) {
    let tag;
    this._elementTags.innerHTML = '';
    for (let val in this._options) {
      tag = Manipulator.createElementFromHTML('\
      <div class="c-tag">'+this._options[val]+'\
        <button class="btn btn-default" value="'+val+'">&times;</button>\
      </div>');
      this._elementTags.append(tag);
    }
    this._addTagsEventListeners();
  }

  _onTagDelClick(element) {
    const val = element.value;
    if (val!==undefined) {
      delete this._options[val];
      this._updateTags();
    }
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      let data = Data.getData(this, DATA_KEY)

      if (!data) {
        data = new MultiSelect(this)
      }

      switch (config){
        case 'close':
        case 'open':
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
  }

  static new(element, config) {
    let data = Data.getData(element, DATA_KEY)
    if (!data) {
      return new MultiSelect(element, config);
    }
    return data;
  }

  static destroy(element) { // remove instance connected to element
    let data = Data.getData(element, DATA_KEY)
    if (data) {
      if (element.parentNode) {
        element.parentNode.removeChild(element)
      }
      MultiSelect.destroyInstance(data);
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


const $ = getjQuery()

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .multiselect to jQuery only if jQuery is present
 */

/* istanbul ignore if */
if ($) {
  const JQUERY_NO_CONFLICT = $.fn[NAME]
  $.fn[NAME] = MultiSelect.jQueryInterface
  $.fn[NAME].Constructor = MultiSelect
  $.fn[NAME].noConflict = () => {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return MultiSelect.jQueryInterface
  }
}

export default MultiSelect
