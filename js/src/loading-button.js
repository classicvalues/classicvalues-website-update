/**
 * --------------------------------------------------------------------------
 * CoreUI (v3.?): loading-button.js
 * Licensed under MIT (https://coreui.io/license)
 * --------------------------------------------------------------------------
 */

import {
  getjQuery,
  getElementFromSelector,
  typeCheckConfig
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

const NAME = 'loadingbutton'
const VERSION = '3.2.2'
const DATA_KEY = 'coreui.loadingbutton'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const SELECTOR_SPINNER = '[data-spinner="true"]'

const EVENT_START = `start${EVENT_KEY}`
const EVENT_STOP = `stop${EVENT_KEY}`

const CLASSNAME_LOADING_BUTTON = 'c-loading-button'

const Default = {
  loading: false,
  progress: 100,//
  waitOnEnd: true,//
  time: 2.5,//
  variant: 'left-to-right',
  stripeColor: 'rgba(0, 0, 0, 0.1)',//
  showSpinner: false, //
  ///
  //track: false,
  //trackInterval: 1,
}

const DefaultType = {
  loading: 'boolean',
  progress: 'number',
  waitOnEnd: 'boolean',
  time: 'number',
  variant: 'string',
  stripeColor: 'string',
  showSpinner: 'boolean'
}

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class LoadingButton {

  constructor(element, config) {

    if (Data.getData(element, DATA_KEY)) { // already found
      //this._elementStripe = SelectorEngine.findOne('.c-stripe', element);
      return;
    }

    this._element = element
    this._config = this._getConfig(config)

    if (this._element) {
      Data.setData(element, DATA_KEY, this)
    }

    this._elementSpinner = SelectorEngine.findOne(SELECTOR_SPINNER, element);
    if (this._elementSpinner) {
      this._elementSpinner.style.display = 'none';
    }

    this._elementStripe = this._addStripe(element);

    if (this._config.loading)
      this.start();

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

  start(element) {
    let rootElement = this._element
    if (element) {
      rootElement = this._getRootElement(element)
    }
    const customEvent = this._triggerStartEvent(rootElement)
    if (customEvent === null || customEvent.defaultPrevented) {
      return
    }
    setTimeout(()=>{
      this._animateStripe(this._elementStripe, this._elementSpinner);
      setTimeout(()=>{
        if (!this._config.waitOnEnd)
          this.stop();
      }, this._config.time*1000);
    }, 1);
  }

  stop(element) {
    const customEvent = this._triggerStopEvent(this._element)
    if (customEvent === null || customEvent.defaultPrevented) {
      return;
    }
    this._stopStripe(this._elementStripe, this._elementSpinner);
  }

  progress(element, val) {
    this._config.progress = val;
  }

  dispose() {
    Data.removeData(this._element, DATA_KEY)
    this._element = null
  }


  // Private

  /*
  const tracking = ()=>{
    if (!loadingState)
      return;
    if (onChange){
      let realProgress=null;
      realProgress = onChange('loading', loadingTime);
      if (realProgress){

        //recalculate
        let newTime = loadingTime/realProgress;
        newTime = newTime*(progress-realProgress);
        refStripe.current.style.transition = 'left 0s linear';
        refStripe.current.style.left = (-100+realProgress)+'%';

        data.trackTimeout2 = setTimeout(()=>{
          refStripe.current.style.transition = 'left '+newTime+'s linear'
          refStripe.current.style.left = (-100+progress)+'%';

          //on end
          clearTimeout(data.endTimeout);
          data.endTimeout = setTimeout(()=>{
            if (onChange)
              onChange('end');
            if (progress===100 && waitOnEnd===false){
              setLoadingState(false);
            }
          }, newTime*1000);

        }, 0);

      }
    }
    loadingTime+=trackInterval;
    data.trackTimeout = setTimeout(tracking, trackInterval*1000);
  }
  */

  _getConfig(config) {
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

  _getRootElement(element) {
    //getElementFromSelector(element) || - data-target?
    return element.closest(`.${CLASSNAME_LOADING_BUTTON}`)
  }

  _triggerStartEvent(element) {
    return EventHandler.trigger(element, EVENT_START)
  }

  _triggerStopEvent(element) {
    return EventHandler.trigger(element, EVENT_STOP)
  }

  _addStripe(element) {
    const html = '<div class="c-stripe" style="\
    background-color: '+this._config.stripeColor+';\
    "></div>';
    const stripe = Manipulator.createElementFromHTML(html);
    this._resetStripe(stripe);
    element.prepend(stripe);
    return stripe;
  }

  _resetStripe(element) {
    element.style.transition = 'left 0s linear';
    element.style.left = '-100%';
  }

  _stopStripe(element, elementSpinner) {
    this._resetStripe(element);
    if (elementSpinner)
      elementSpinner.style.display = 'none';
  }

  _animateStripe(element, elementSpinner) {
    element.style.transition = 'left '+this._config.time+'s linear';
    element.style.left = (-100+this._config.progress)+'%';
    if (elementSpinner)
      elementSpinner.style.display = 'inline-block';
  }


  // Static

  static jQueryInterface(config, par) {
    return this.each(function () {
      let data = Data.getData(this, DATA_KEY)

      if (!data) {
        data = new LoadingButton(this)
      }

      switch (config){
        case 'start':
        case 'stop':
        data[config](this)
        break;
        case 'progress':
        data[config](this, par)
        break;
      }
    })
  }

  static getInstance(element) {
    return Data.getData(element, DATA_KEY)
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
 * add .loadingbutton to jQuery only if jQuery is present
 */

/* istanbul ignore if */
if ($) {
  const JQUERY_NO_CONFLICT = $.fn[NAME]
  $.fn[NAME] = LoadingButton.jQueryInterface
  $.fn[NAME].Constructor = LoadingButton
  $.fn[NAME].noConflict = () => {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return LoadingButton.jQueryInterface
  }
}

export default LoadingButton
