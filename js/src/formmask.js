/**
 * --------------------------------------------------------------------------
 * CoreUI (v4.0.1): formmask.js
 * Licensed under MIT (https://coreui.io/license)
 *
 * This component is a modified version of the Bootstrap's button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { defineJQueryPlugin } from './util/index'
import EventHandler from './dom/event-handler'
import BaseComponent from './base-component'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'formmask'
const DATA_KEY = 'coreui.formmask'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const CLASS_NAME_ACTIVE = 'active' //?

const SELECTOR_DATA_TOGGLE = '[data-coreui-toggle="button"]' //?

const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}` //?

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class FormMask extends BaseComponent {
  // Getters

  static get NAME() {
    return NAME
  }

  // Public

  toggle() {
    // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
    this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE))
  }

  // Private

  // warn about mask
  _wrongMask(msg:string) {
    console.warn(`Wrong mask format (${msg})!`)
  }

  // check value in context of whole input value
  _checkValueForInput(type:string, value: string) {
    switch (type) {
      case 'year':
      case 'month':
      case 'day':
        const values:{
          year?: string
          month?: string
          day?: string
        } = {}
        for (let part of data.maskPart)
          switch (part.type) {
            case 'year':
            case 'month':
            case 'day':
              values[part.type] = part.type===type ? value : part.value
              break
          }
        // check date
        if (!values.year) values.year = '1970'
        if (!values.month) values.month = '01'
        if (!values.day) values.day = '01'
        if (isNaN(Date.parse(`${values.year.length>1 ? values.year : '0'+values.year}-${values.month.length>1 ? values.month : '0'+values.month}-${values.day.length>1 ? values.day : '0'+values.day}`)))
          return false
        break
    }
    return true
  }

  // check value for mask part
  _checkValueForPart(value:string, part:maskPartType, ready = false) {
    //console.log(part.type, value, value.length)
    // check
    switch(part.type) {
      case 'number':
      case 'year':
      case 'month':
      case 'day':
      case 'hour':
      case 'minute':
        // is a number
        if (value && value!==Number(value).toString() && value!=='0'+Number(value).toString())
          return false
        // is in range; ok for in progress
        if (!ready && value.length<part.length)
          break
        if (part.valueFrom && Number(value)<part.valueFrom)
          return false
        else if (part.valueTo && Number(value)>part.valueTo)
          return false
        // check whole value
        if (!checkValueForInput(part.type, value))
          return false
        break;
      case 'string':
        // ok for in progress
        if (!ready && value.length<part.length)
          break
        // has proper length
        if (part.lengthFrom && value.length<part.lengthFrom)
          return false
        else if (part.lengthTo && value.length>part.lengthTo)
          return false
        break;
      case 'regular':
        // ok for in progress
        if (!ready && value.length<part.length)
          break
        // test regular expresion
        const reg = new RegExp(part.expresion||'')
        if (!reg.test(value))
          return false
        break;
    }
    // TODO: add onCheck callback prop
    // if (onCheck && !onCheck(data.maskPart))
    //   return false
    return true
  }

  // check whole input value
  _checkValue() {
    for (let part of data.maskPart)
      if (!checkValueForPart(part.value, part, true))
        return false
    return true
  }

  // check part value and render final version
  _renderPart(part:maskPartType) {
    //const part = data.maskPart[idx]
    // check type
    // if (value && !checkValueForPart(value, part))
    //   return {check: false, render: ''}
    // render
    let renderedPart = ''
    renderedPart += part.value || ''
    if (renderedPart==='')
      for (let i = part.value ? part.value.length : 0; i<part.length; i++)
        renderedPart += '.'
    return renderedPart
  }

  // find parameters value ('(...)') based on string starting with '('
  _findParametersEnd(s:string) {
    let opening = 0
    for (let i=0; i<s.length; i++)
      if (s[i]==='(')
        opening++
      else if (s[i]===')') {
        opening--
        if (opening===0)
          return [s.substr(0, i+1), s.substr(i+1)]
      }
    return null
  }

  // render input value based on maskPart object
  _renderValue() {
    let value = ''
    for (let part of data.maskPart)
      value += renderPart(part)
    return value
  }

  // update value
  // on change input handler
  _updateValue(value:string, cursorPos: number) {
    let start = 0
    let modified = false
    for (let i=0; i<data.maskPart.length; i++) {
      const length = data.maskPart[i].length
      let limiterIdx = -1
      let limiter = null
      if (i+1<data.maskPart.length) {
        limiter = data.maskPart[i+1].value
        limiterIdx = value.indexOf(limiter, start)
      }
      if (data.maskPart[i].type!=='const') {
        let v = ''
        let idx
        let lastIdx = 0
        for (idx=start; idx<start+length; idx++) {
          if (limiterIdx>-1 && idx===limiterIdx)
            break
          if (value[idx] && value[idx]!=='.') {
            v += value[idx]
            lastIdx++
          }
        }
        // set new value for mask part
        //console.log(v, data.maskPart[i].value)
        if (checkValueForPart(v, data.maskPart[i])) {
          if (v!==data.maskPart[i].value) {
            //console.log(v, data.maskPart[i].value)
            data.maskPart[i].value = v
            if (limiter && lastIdx===length)
              cursorPos += limiter.length
            modified = true
          }
        }
        //const part = renderPart(i, v)
        //if (part.check)
        //  data.maskPart[i].value = part.render
        start = limiterIdx
      }
      else
        start += length
    }
    //console.log(_maskPart, getValue())
    console.log(modified, changeCounter, setChangeCounter)
    // update input value
    const render = renderValue()
    //console.log(render, value)
    if (render===_value)
      cursorPos = 0
    data.cursorPos = cursorPos
    _setValue(render)
    setChangeCounter(changeCounter+1)
    return render
  }

  //

  _changeMask() {
    data.maskPart = []
    const maskTab = mask.split('%')
    for (let i=0; i<maskTab.length; i++) {
      const getParameters = () => {
        if (maskTab[i][1]!=='(') {
          //console.log(maskTab[i])
          wrongMask(`'(' not found`)
          return null
        }
        const parameters = findParametersEnd(maskTab[i])
        //console.log(parameters)
        if (parameters===null) {
          wrongMask('parameters not found')
          return null
        }
        return parameters
      }

      let minLength = 0
      let maxLength = 0
      let range: string[]
      let length, par
      let parameters

      if (i===0) {
        if (maskTab[i].length>0)
          data.maskPart.push({
            type: 'const', length: maskTab[i].length, value: maskTab[i]
          })
        continue
      }

      switch (maskTab[i][0]) {
        case 'n': // number found
          parameters = getParameters()
          if (parameters===null)
            break;
          par = parameters[0]
          range = par.substr(2, par.length-3).split('to')
          if (range.length!==2) {
            wrongMask('wrong parameters number')
            break
          }
          range.forEach( (_, idx) => range[idx] = range[idx].trim() )
          minLength = range[0].length
          maxLength = range[1].length
          length = minLength>maxLength ? minLength : maxLength
          data.maskPart.push({
            type: 'number', length, value: ''
          })
          data.maskPart[ data.maskPart.length-1 ].valueFrom = Number(range[0])
          data.maskPart[ data.maskPart.length-1 ].valueTo = Number(range[1])
          break

        case 's': // string found
          parameters = getParameters()
          if (parameters===null)
            break;
          par = parameters[0]
          range = par.substr(2, par.length-3).split('to')
          if (range.length!==2) {
            wrongMask('wrong parameters number')
            break
          }
          range.forEach( (_, idx) => range[idx] = range[idx].trim() )
          minLength = Number(range[0])
          maxLength = Number(range[1])
          length = minLength>maxLength ? minLength : maxLength
          data.maskPart.push({
            type: 'string', length, value: ''
          })
          data.maskPart[ data.maskPart.length-1 ].lengthFrom = Number(range[0])
          data.maskPart[ data.maskPart.length-1 ].lengthTo = Number(range[1])
          break

        case 'r': // regular expresion found
          parameters = getParameters()
          if (parameters===null)
            break;
          par = parameters[0]
          const pars = par.substr(2, par.length-3).split(' size ')
          if (pars.length<2) {
            wrongMask('wrong parameters number')
            break
          }
          pars.forEach( (_, idx) => pars[idx] = pars[idx].trim() )
          const size = pars[pars.length-1]
          pars.pop()
          data.maskPart.push({
            type: 'regular', expresion: pars.join(' size '), length: Number(size), value: ''
          })
          break

        // date

        case 'y':
          data.maskPart.push({
            type: 'year', length: 4, valueFrom: 1970, valueTo: 2100, value: ''
          })
          break

        case 'm':
          data.maskPart.push({
            type: 'month', length: 2, valueFrom: 1, valueTo: 12, value: ''
          })
          break

        case 'd':
          data.maskPart.push({
            type: 'day', length: 2, valueFrom: 1, valueTo: 31, value: ''
          })
          break

        case 'h':
          data.maskPart.push({
            type: 'hour', length: 2, valueFrom: 0, valueTo: 23, value: ''
          })
          break

        case 'i': // minute or second
          data.maskPart.push({
            type: 'minute', length: 2, valueFrom: 0, valueTo: 59, value: ''
          })
          break
      }

      if ('nsr'.indexOf(maskTab[i][0])>-1) { // parameters types
        // handle part next to parameters
        if (parameters && parameters[1]!=='')
          data.maskPart.push({
            type: 'const', length: parameters[1].length, value: parameters[1]
          })
      }

      if ('ymdhi'.indexOf(maskTab[i][0])>-1) { // no parameters types
        // handle part next to parameters
        const next = maskTab[i].substr(1)
        if (next!=='')
          data.maskPart.push({
            type: 'const', length: next.length, value: next
          })
      }

    }
    //console.log(data.maskPart)
    _setValue(renderValue())

  }

  // prop value change
  _changeValue() {
    value && typeof value === 'string' && updateValue(value, 0)
  })

  // restore cursor position
  _restoreCursor() {
    console.log(inputRef, ref)
    const input = inputRef.current
    if (input) {
      input.selectionStart = data.cursorPos
      input.selectionEnd = data.cursorPos
    }
  }

  // Events

  // on change input handler
  _onChange(e: ChangeEvent<HTMLInputElement>) {
    //console.log(e)
    const value = e.target.value
    //console.log(value)
    const cursorPos = e.target.selectionStart||0
    const render = updateValue(value, cursorPos)
    if (render!=_value) {
      // on change user action
      console.log('check: ', checkValue())
      onChange && onChange(e)
    }
  }

  // on blur input handler
  _onBlur(e: FocusEvent<HTMLInputElement>) {
    //console.log('blur')
    data.cursorPos = null
    onBlur && onBlur(e)
  }
  

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      const data = Button.getOrCreateInstance(this)

      if (config === 'toggle') {
        data[config]()
      }
    })
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, event => {
  event.preventDefault()

  const button = event.target.closest(SELECTOR_DATA_TOGGLE)
  const data = Button.getOrCreateInstance(button)

  data.toggle()
})

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .formmask to jQuery only if jQuery is present
 */

defineJQueryPlugin(FormMask)

export default FormMask
