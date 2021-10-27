/**
 * --------------------------------------------------------------------------
 * CoreUI (v4.0.1): date-picker.js
 * Licensed under MIT (https://coreui.io/license)
 *
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { defineJQueryPlugin } from './util/index'
import EventHandler from './dom/event-handler'
import BaseComponent from './base-component'

/*
  children,
  className,
  show:propShow = true,
  ...rest
*/

const Default = {
  mask: '%n(1 to 105)',
  value: '',
  //
  showNavi: true,
  monthsNames: [],
  daysNames: [],
  range: false,
  helper: false
}

const DefaultType = {
  mask: 'string',
  value: 'string',
  //
  showNavi: 'boolean',
  monthsNames: 'array', //string
  daysNames: 'array', //string
  range: 'boolean',
  helper: 'boolean',
  date: 'string',
  dateTo: 'string',
  focus: 'string',
  minDate: 'string',
  maxDate: 'string',
  lang: 'string',
  onChange: 'function', //(date:string, dateTo?:string)=>boolean
  onPageChange: 'function', //(year:number, month:number)=>boolean
  onNotification: 'function' //(name:string)=>void
}

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'date-picker'
const DATA_KEY = 'coreui.date-picker'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const CLASS_NAME_ACTIVE = 'active' //?

const SELECTOR_DATA_TOGGLE = '[data-coreui-toggle="button"]' //?

const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}` //?


//
const SELECTOR_COMPONENT = '.c-data-picker'
const EVENT_CHANGED = `changed${EVENT_KEY}`
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class DatePicker extends BaseComponent {

  constructor(element, config) {
    super(element)

    //this._popper = null
    //this._config = this._getConfig(config)
    //this._menu = this._getMenuElement()
    //this._inNavbar = this._detectNavbar()

    this.update(config)

    //instance data
    this.data = {}

    this._addEventListeners()
  }

  // Getters

  static get Default() {
    return Default
  }

  static get DefaultType() {
    return DefaultType
  }

  static get NAME() {
    return NAME
  }

  // Public

  update(config) { // public method
    const mask = this._config ? this._config.mask : ''
    const value = this._config ? this._config.value : ''
    this._config = this._getConfig(config)
    if (this._config.mask!==mask)
      this._changeMask()
    if (this._config.value!==value)
      this._changeValue()
  }

  // ?
  // toggle() {
  //   // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
  //   this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE))
  // }

  // Private

  _getConfig(config, update) {
    if (update !== true) {
      config = {
        ...this.constructor.Default,
        ...Manipulator.getDataAttributes(this._element),
        ...config
      }
    }
    typeCheckConfig(
      NAME,
      config,
      this.constructor.DefaultType
    )
    return config
  }

  // add event listeners
  _addEventListeners() {
    EventHandler.on(this._element, EVENT_CHANGED, (e) => {
      alert('change')
      this._onChange(e)
    })

    // EventHandler.on(this._clone, EVENT_CLICK, () => {
    //   this.show()
    // })
    //
    // EventHandler.on(this._searchElement, EVENT_KEYUP, () => {
    //   this._onSearchChange(this._searchElement)
    // })
    //
    // EventHandler.on(this._searchElement, EVENT_KEYDOWN, event => {
    //   const key = event.keyCode || event.charCode
    //
    //   if ((key === 8 || key === 46) && event.target.value.length === 0) {
    //     this._selectionDeleteLast()
    //   }
    // })
    //
    // EventHandler.on(this._optionsElement, EVENT_CLICK, event => {
    //   event.preventDefault()
    //   event.stopPropagation()
    //   this._onOptionsClick(event.target)
    // })
    //
    // EventHandler.on(this._selectionCleanerElement, EVENT_CLICK, event => {
    //   event.preventDefault()
    //   event.stopPropagation()
    //   this._selectionClear()
    //   this._updateSelection()
    //   // this._updateSelectionCleaner()
    //   this._updateSearch()
    //   this._updateSearchSize()
    // })
    //
    // EventHandler.on(this._optionsElement, EVENT_KEYDOWN, event => {
    //   const key = event.keyCode || event.charCode
    //
    //   if (key === 13) {
    //     this._onOptionsClick(event.target)
    //     SelectorEngine.findOne(SELECTOR_INPUT, this._clone).focus()
    //   }
    // })
  }

  // data

  props

  // state

  calendarYear
  minDay


  // fuctions

  // global
  setState(variable, value) {
    this[variable] = value
    // update?2
  }

  // list
  // setCalendarPage

  // set calendar page+
  setCalendarPage(year:number, month:number) {
    const props = this.props
    const limitedDate = getLimitedDate(year, month)
    if (props.onPageChange && !props.onPageChange(year, month))
      return false
    if (limitedDate[0]!==year || limitedDate[1]!==month)
      props.onNotification && props.onNotification('calendar-page-range')
    this.setState('calendarYear', limitedDate[0])
    this.setState('calendarMonth', limitedDate[1])
    return true
  }

    // check if given date is correct
    checkLimitedDate(year:number, month:number) {
      const t = this
      if (t.minDay===100 &&
        t.year<t.minYear || t.year===t.minYear && t.month<=t.minMonth) return 'min'
      if (t.maxDay===100 &&
        t.year>t.maxYear || t.year===t.maxYear && t.month>=t.maxMonth) return 'max'
      return 'ok'
    }

    // return date or min/max date if outside range
    getLimitedDate(year:number, month:number):any[] {
      const t = this
      let limitedYear = t.year
      let limitedMonth = t.month
      if (checkLimitedDate(t.year, t.month)==='min') {
        if (t.minMonth===11) {
          limitedMonth = 0
          limitedYear = t.minYear+1
        }
        else {
          limitedMonth = t.minMonth+1
          limitedYear = t.minYear
        }
      }
      else if (checkLimitedDate(t.year, t.month)==='max') {
        if (t.maxMonth===0) {
          limitedMonth = 11
          limitedYear = t.maxYear-1
        }
        else {
          limitedMonth = t.maxMonth-1
          limitedYear = t.maxYear
        }
      }
      return [limitedYear, limitedMonth]
    }

    //computation

    computation() {

      // language
      if (props.monthsNames.length===0) {
        if (lang) {
          props.monthsNames = []
        }
        else
          props.monthsNames = MONTHS_NAMES
      }
      if (props.daysNames.length===0) {
        if (props.lang) {
          props.daysNames = []
        }
        else
          props.daysNames = DAYS_NAMES
      }

      //
      const firstDayNumber = getDayNumber(`${calendarMonth+1}/1/${calendarYear}`)
      const daysInMonth = getDaysInMonth(calendarMonth+1, calendarYear)
      let number = 0
      const days:dayType[] = []
      //console.log(calendarYear, calendarMonth, year, month, day)
      for (let i=0; i<37; i++) { // max 31 days + 6 for Sunday
        if (i>=firstDayNumber)
          number++
        if (number>daysInMonth)
          break
        // mark current day
        let current = false
        if (number===getCurrentDay()
          && calendarMonth===getCurrentMonth()
          && calendarYear===getCurrentYear())
          current = true
        // mark selected day
        let selected = false
        // if (day===number
        //   && calendarMonthmonth
        //   && calendarYear===year)
        //   selected = true
        if (!range && day!==-1) {
          if (year===calendarYear && month===calendarMonth && number===day)
            selected = true
        }
        else { // range mode
          if ((day!==-1 &&
              (year<calendarYear ||
              year===calendarYear && month<calendarMonth ||
              year===calendarYear && month===calendarMonth && number>=day)) &&
              (dayTo!==-1 &&
              (yearTo>calendarYear ||
              yearTo===calendarYear && monthTo>calendarMonth ||
              yearTo===calendarYear && monthTo===calendarMonth && number<=dayTo)))
            selected = true
        }
        // mark hover
        let over = false
        if (range && day!==-1 && dayTo===-1 && dayOver!==-1) { // range mode - select from date to cursor
          if ((year<calendarYear ||
              year===calendarYear && month<calendarMonth ||
              year===calendarYear && month===calendarMonth && number>=day) &&
              (number<=dayOver))
            over = true
        }
        else if (number===dayOver) // date mode - select cursor only
          over = true
        // add day info
        days.push({
          number,
          current,
          selected,
          over
        })
      }

      // render

      const _className = classNames(
        className
      )

      const className_calendar = classNames(
        'c-calendar',
        show ? '' : 'd-none'
      )

      // render js->

    }

    // memo

    useMemo(f, dep) {
      //...
    }

    checkVariables() {

      // handling of 'date' props change
      useMemo(()=>{
        const props = this.props
        // set year/month limits, correct range is (year-min/month-min, yearmax/month-max)
        if (props.minDate) {
          const minDateObj = new Date(minDate)
          t.setState(minYear, minDateObj.getFullYear())
          t.setState(minMonth, minDateObj.getMonth())
          t.setState(minDay, 100) // 100 if min/max date is set
        }
        else
          t.setState(maxDay, -1)
        if (props.maxDate) {
          const maxDateObj = new Date(maxDate)
          t.setState(maxYear,maxDateObj.getFullYear())
          t.setState(maxMonth, maxDateObj.getMonth())
          t.setState(maxDay, 100) // 100 if min/max date is set
        }
        else
          t.setState(maxDay, -1)
      }, [minDate, maxDate])

      // handling of 'date' props change
      useMemo(()=>{
        // set initial date
        if (props.date) {
          const dateObj = new Date(date)
          // set selected date
          t.setState(year, dateObj.getFullYear())
          t.setState(month, dateObj.getMonth())
          t.setState(day, dateObj.getDate())
        }
        else
          t.setState(day, -1)
        // range selection available
        if (range && dateTo) {
          const dateObj = new Date(dateTo)
          t.setState(yearTo, dateObj.getFullYear())
          t.setState(monthTo, dateObj.getMonth())
          t.setState(dayTo, dateObj.getDate())
        }
        else
          t.setState(dayTo, -1)
      }, [range, date, dateTo])

    }

    // after - spr

    after() {
      // handling of 'date' props change
      useEffect(()=>{
        const props = this.props
        const t = this
        // set calendar page to focus
        //console.log(year, month, minYear, minMonth, maxYear, maxMonth)
        let set = false
        switch (props.focus) {
          case 'date':
            if (props.date) {
              setCalendarPage(t.year, t.month)
              set = true
            }
            break
          case 'date-to':
            if (props.dateTo) {
              setCalendarPage(t.yearTo, t.monthTo)
              set = true
            }
            break
          case 'date-min':
            if (props.minDate) {
              setCalendarPage(t.minYear, t.minMonth)
              set = true
            }
            break
          case 'date-max':
            if (props.maxDate) {
              setCalendarPage(t.maxYear, t.maxMonth)
              set = true
            }
            break
          default:
            if (t.focus) {
              const focusDateObj = new Date(t.focus)
              setCalendarPage(focusDateObj.getFullYear(), focusDateObj.getMonth())
              set = true
            }
        }
        if (!set)
          setCalendarPage(getCurrentYear(), getCurrentMonth())
      }, [focus, minDate, maxDate])
    }

    render() {
      const t = this

      const CalendarCard = () => {
        switch (t.view) {
          case 'days':
            return (
              `
                ${t.daysNames.map((item, idx) => `<div key=${idx} className="c-cell" style=${style_dayName}>${item}</div>`)}
                <div onMouseOut=${() => setDayOver(!t.helper ? 31 : -1)}>
                ${t.days.map((item, idx) => {
                  const style_day_mod = {...style_day}
                  if (item.current)
                    style_day_mod['background'] = 'red'
                  if (item.over) {
                    if (item.current)
                      style_day_mod['background'] = '#ffaaaa'
                    else
                      style_day_mod['background'] = '#e0e0e0'
                  }
                  if (item.selected) {
                    if (item.current)
                      style_day_mod['background'] = '#ff5555'
                    else
                      style_day_mod['background'] = '#c0c0c0'
                  }
                  return `
                    <div
                      key=${idx}
                      className="c-day"
                      style=${style_day_mod}
                      onMouseOver=${() => {
                        if (item.number!==0)
                          t.setState('dayOver', item.number)
                      }}
                      onClick=${() => {
                        // set date
                        if (!t.range) {
                          if (t.onChange && !t.onChange(`${t.calendarMonth+1}/${item.number}/${t.calendarYear}`))
                            return false
                          t.setState('day', item.number)
                          t.setState('month', t.calendarMonth)
                          t.setState('year', t.calendarYear)
                          return true
                        }
                        else {
                          if (t.day===-1 || t.dayTo!==-1) { // from selection dont exist or both exists
                            if (t.onChange && !t.onChange(`${t.calendarMonth+1}/${item.number}/${t.calendarYear}`))
                              return false
                            t.setState('day', item.number)
                            t.setState('month', calendarMonth)
                            t.setState('year', calendarYear)
                            t.setState('dayTo', -1)
                            return true
                          }
                          else { // to selection dont exist
                            if (new Date(`${t.month+1}/${t.day}/${t.year}`).getTime() >=
                            new Date(`${t.calendarMonth+1}/${item.number}/${t.calendarYear}`).getTime()) {
                              t.onNotification && t.onNotification('wrong-selection')
                              return false
                            }
                            if (t.onChange && !t.onChange(
                              `${t.month+1}/${t.day}/${t.year}`,
                              `${t.calendarMonth+1}/${item.number}/${t.calendarYear}`
                            ))
                              return false
                            t.setState('dayTo', item.number)
                            t.setState('monthTo', t.calendarMonth)
                            t.setState('yearTo', t.calendarYear)
                            return true
                          }
                        }
                      }}
                    >
                      ${item.number!==0 ? item.number : DAY_SIGN}
                    </div>
                  `
                })}
                </div>
              `
            )
          case 'months':
            return (
              `
                ${t.monthsNames.map((item, idx) => {
                  // select month
                  return (
                    `<div
                      key=${idx}
                      className="c-month"
                      style=${style_month}
                      onClick=${() => {
                        setCalendarPage(t.calendarYear, idx)
                        t.setState('view', 'days')
                      }}
                    >
                      {item}
                    </div>`
                  )
                })}
              `
            )
          case 'years':
            const yearsList = []
            for (let year=t.calendarYear - 4; year<t.calendarYear+4; year++)
              yearsList.push({
                year
              })
            return (
              `
                ${yearsList.map((item, idx) => {
                  // select year
                  return (
                    `<div
                      key=${idx}
                      className="c-year"
                      style=${style_year}
                      onClick=${() => {
                        t.setCalendarPage(item.year, t.calendarMonth)
                        t.setState('view', 'days')
                      }}
                    >
                      {item.year}
                    </div>`
                  )
                })}
              `
            )
          default:
            return ''
        }
      }

      return `
        <div
          className=${_className}
          ${...rest}
          ref=${ref}
        >
          ${children ? `
          <div onClick=${() => (!t.show)}>
            ${children}
          </div>` : ``}
          <div style=${t.styleMonth}>
            <div style=${t.styleLeft}>
              ${t.showNavi? `
                <CLink active="false" onClick=${() => {
                  if (checkLimitedDate(calendarYear-1, calendarMonth)==='ok')
                    setCalendarPage(calendarYear-1, calendarMonth)
                }}>&lt;&lt;</CLink>
                &nbsp;
                <CLink component="span" onClick=${() => {
                  if (t.calendarMonth>0) { // month >= 1
                    if (t.checkLimitedDate(t.calendarYear, t.calendarMonth-1)==='ok')
                      t.setCalendarPage(t.calendarYear, t.calendarMonth-1)
                  }
                  else { // month 0
                    if (t.checkLimitedDate(t.calendarYear-1, 11)==='ok')
                      t.setCalendarPage(t.calendarYear-1, 11)
                  }
                }}>&lt;</CLink>
              ` : ``}
            </div>
            <div style=${styleCenter}>
              <span onClick=${() => t.showNavi ? t.setState('view', 'months') : null}>
                ${t.monthsNames[t.calendarMonth]}
              </span>
              &nbsp;
              <span onClick=${() => t.showNavi ? t.setState('view', 'years') : null}>
                ${t.calendarYear}
              </span>
            </div>
            ${t.showNavi ? `
            <div style=${t.styleRight}>
              <CLink component="span" onClick=${() => {
                if (t.calendarMonth<11) {
                  if (t.checkLimitedDate(t.calendarYear, t.calendarMonth+1)==='ok')
                    t.setCalendarPage(t.calendarYear, t.calendarMonth+1)
                }
                else {
                  if (t.checkLimitedDate(t.calendarYear+1, 0)==='ok')
                    t.setCalendarPage(t.calendarYear+1, 0)
                }
              }}>&gt;</CLink>
              &nbsp;
              <CLink component="span" onClick=${() => {
                if (t.checkLimitedDate(t.calendarYear+1, t.calendarMonth)==='ok')
                  t.setCalendarPage(t.calendarYear+1, t.calendarMonth)
              }}>&gt;&gt;</CLink>
            </div>` : ``}
          </div>
          <div
            style=${style}
            className=${className_calendar}
          >
            ${CalendarCard()}
            ${t.showNavi&&view==='days' ? `
            <div onClick=${() => {
              setCalendarPage(t.getCurrentYear(), t.getCurrentMonth())
            }}>{TODAY}</div>` : ``}
          </div>
        </div>
      `
    }

  // warn about mask
  // _wrongMask(msg) {
  //   console.warn(`Wrong mask format (${msg})!`)
  // }

  // check value in context of whole input value
  // _checkValueForInput(type, value) {
  //   switch (type) {
  //     case 'year':
  //     case 'month':
  //     case 'day':
  //       const values = {}
  //       for (let part of this.data.maskPart)
  //         switch (part.type) {
  //           case 'year':
  //           case 'month':
  //           case 'day':
  //             values[part.type] = part.type===type ? value : part.value
  //             break
  //         }
  //       // check date
  //       if (!values.year) values.year = '1970'
  //       if (!values.month) values.month = '01'
  //       if (!values.day) values.day = '01'
  //       if (isNaN(Date.parse(`${values.year.length>1 ? values.year : '0'+values.year}-${values.month.length>1 ? values.month : '0'+values.month}-${values.day.length>1 ? values.day : '0'+values.day}`)))
  //         return false
  //       break
  //   }
  //   return true
  // }

  // check value for mask part
  // _checkValueForPart(value, part, ready = false) {
  //   //console.log(part.type, value, value.length)
  //   // check
  //   switch(part.type) {
  //     case 'number':
  //     case 'year':
  //     case 'month':
  //     case 'day':
  //     case 'hour':
  //     case 'minute':
  //       // is a number
  //       if (value && value!==Number(value).toString() && value!=='0'+Number(value).toString())
  //         return false
  //       // is in range; ok for in progress
  //       if (!ready && value.length<part.length)
  //         break
  //       if (part.valueFrom && Number(value)<part.valueFrom)
  //         return false
  //       else if (part.valueTo && Number(value)>part.valueTo)
  //         return false
  //       // check whole value
  //       if (!checkValueForInput(part.type, value))
  //         return false
  //       break;
  //     case 'string':
  //       // ok for in progress
  //       if (!ready && value.length<part.length)
  //         break
  //       // has proper length
  //       if (part.lengthFrom && value.length<part.lengthFrom)
  //         return false
  //       else if (part.lengthTo && value.length>part.lengthTo)
  //         return false
  //       break;
  //     case 'regular':
  //       // ok for in progress
  //       if (!ready && value.length<part.length)
  //         break
  //       // test regular expresion
  //       const reg = new RegExp(part.expresion||'')
  //       if (!reg.test(value))
  //         return false
  //       break;
  //   }
  //   // TODO: add onCheck callback prop
  //   // if (onCheck && !onCheck(this.data.maskPart))
  //   //   return false
  //   return true
  // }

  // check whole input value
  // _checkValue() {
  //   for (let part of this.data.maskPart)
  //     if (!checkValueForPart(part.value, part, true))
  //       return false
  //   return true
  // }

  // check part value and render final version
  // _renderPart(part) {
  //   //const part = this.data.maskPart[idx]
  //   // check type
  //   // if (value && !checkValueForPart(value, part))
  //   //   return {check: false, render: ''}
  //   // render
  //   let renderedPart = ''
  //   renderedPart += part.value || ''
  //   if (renderedPart==='')
  //     for (let i = part.value ? part.value.length : 0; i<part.length; i++)
  //       renderedPart += '.'
  //   return renderedPart
  // }

  // find parameters value ('(...)') based on string starting with '('
  // _findParametersEnd(s) {
  //   let opening = 0
  //   for (let i=0; i<s.length; i++)
  //     if (s[i]==='(')
  //       opening++
  //     else if (s[i]===')') {
  //       opening--
  //       if (opening===0)
  //         return [s.substr(0, i+1), s.substr(i+1)]
  //     }
  //   return null
  // }

  // render input value based on maskPart object
  // _renderValue() {
  //   let value = ''
  //   for (let part of this.data.maskPart)
  //     value += renderPart(part)
  //   return value
  // }

  // update value
  // _updateValue(value, cursorPos) {
  //   let start = 0
  //   let modified = false
  //   for (let i=0; i<this.data.maskPart.length; i++) {
  //     const length = this.data.maskPart[i].length
  //     let limiterIdx = -1
  //     let limiter = null
  //     if (i+1<this.data.maskPart.length) {
  //       limiter = data.maskPart[i+1].value
  //       limiterIdx = value.indexOf(limiter, start)
  //     }
  //     if (this.data.maskPart[i].type!=='const') {
  //       let v = ''
  //       let idx
  //       let lastIdx = 0
  //       for (idx=start; idx<start+length; idx++) {
  //         if (limiterIdx>-1 && idx===limiterIdx)
  //           break
  //         if (value[idx] && value[idx]!=='.') {
  //           v += value[idx]
  //           lastIdx++
  //         }
  //       }
  //       // set new value for mask part
  //       //console.log(v, data.maskPart[i].value)
  //       if (checkValueForPart(v, this.data.maskPart[i])) {
  //         if (v!==this.data.maskPart[i].value) {
  //           //console.log(v, data.maskPart[i].value)
  //           this.data.maskPart[i].value = v
  //           if (limiter && lastIdx===length)
  //             cursorPos += limiter.length
  //           modified = true
  //         }
  //       }
  //       //const part = renderPart(i, v)
  //       //if (part.check)
  //       //  data.maskPart[i].value = part.render
  //       start = limiterIdx
  //     }
  //     else
  //       start += length
  //   }
  //   //console.log(_maskPart, getValue())
  //   //console.log(modified, changeCounter, setChangeCounter)
  //   // update input value
  //   const render = renderValue()
  //   //console.log(render, value)
  //   if (render===_value)
  //     cursorPos = 0
  //   // update value
  //   _setValue(render)
  //   //setChangeCounter(changeCounter+1)
  //   // set cursor position
  //   //this.data.cursorPos = cursorPos
  //   this._element.selectionStart = cursorPos
  //   this._element.selectionEnd = cursorPos
  //   return render
  // }

  // _setValue(value) {
  //   // change input attribute
  //   this._element.value = value
  // }

  // after prop change

  // _changeMask() {
  //   this.data.maskPart = []
  //   const maskTab = this._config.mask.split('%')
  //   for (let i=0; i<maskTab.length; i++) {
  //     const getParameters = () => {
  //       if (maskTab[i][1]!=='(') {
  //         //console.log(maskTab[i])
  //         wrongMask(`'(' not found`)
  //         return null
  //       }
  //       const parameters = findParametersEnd(maskTab[i])
  //       //console.log(parameters)
  //       if (parameters===null) {
  //         wrongMask('parameters not found')
  //         return null
  //       }
  //       return parameters
  //     }
  //
  //     let minLength = 0
  //     let maxLength = 0
  //     let range = []
  //     let length, par
  //     let parameters
  //
  //     if (i===0) {
  //       if (maskTab[i].length>0)
  //         this.data.maskPart.push({
  //           type: 'const', length: maskTab[i].length, value: maskTab[i]
  //         })
  //       continue
  //     }
  //
  //     switch (maskTab[i][0]) {
  //       case 'n': // number found
  //         parameters = getParameters()
  //         if (parameters===null)
  //           break;
  //         par = parameters[0]
  //         range = par.substr(2, par.length-3).split('to')
  //         if (range.length!==2) {
  //           wrongMask('wrong parameters number')
  //           break
  //         }
  //         range.forEach( (_, idx) => range[idx] = range[idx].trim() )
  //         minLength = range[0].length
  //         maxLength = range[1].length
  //         length = minLength>maxLength ? minLength : maxLength
  //         this.data.maskPart.push({
  //           type: 'number', length, value: ''
  //         })
  //         this.data.maskPart[ this.data.maskPart.length-1 ].valueFrom = Number(range[0])
  //         this.data.maskPart[ this.data.maskPart.length-1 ].valueTo = Number(range[1])
  //         break
  //
  //       case 's': // string found
  //         parameters = getParameters()
  //         if (parameters===null)
  //           break;
  //         par = parameters[0]
  //         range = par.substr(2, par.length-3).split('to')
  //         if (range.length!==2) {
  //           wrongMask('wrong parameters number')
  //           break
  //         }
  //         range.forEach( (_, idx) => range[idx] = range[idx].trim() )
  //         minLength = Number(range[0])
  //         maxLength = Number(range[1])
  //         length = minLength>maxLength ? minLength : maxLength
  //         this.data.maskPart.push({
  //           type: 'string', length, value: ''
  //         })
  //         this.data.maskPart[ this.data.maskPart.length-1 ].lengthFrom = Number(range[0])
  //         this.data.maskPart[ this.data.maskPart.length-1 ].lengthTo = Number(range[1])
  //         break
  //
  //       case 'r': // regular expresion found
  //         parameters = getParameters()
  //         if (parameters===null)
  //           break;
  //         par = parameters[0]
  //         const pars = par.substr(2, par.length-3).split(' size ')
  //         if (pars.length<2) {
  //           wrongMask('wrong parameters number')
  //           break
  //         }
  //         pars.forEach( (_, idx) => pars[idx] = pars[idx].trim() )
  //         const size = pars[pars.length-1]
  //         pars.pop()
  //         this.data.maskPart.push({
  //           type: 'regular', expresion: pars.join(' size '), length: Number(size), value: ''
  //         })
  //         break
  //
  //       // date
  //
  //       case 'y':
  //         this.data.maskPart.push({
  //           type: 'year', length: 4, valueFrom: 1970, valueTo: 2100, value: ''
  //         })
  //         break
  //
  //       case 'm':
  //         this.data.maskPart.push({
  //           type: 'month', length: 2, valueFrom: 1, valueTo: 12, value: ''
  //         })
  //         break
  //
  //       case 'd':
  //         this.data.maskPart.push({
  //           type: 'day', length: 2, valueFrom: 1, valueTo: 31, value: ''
  //         })
  //         break
  //
  //       case 'h':
  //         this.data.maskPart.push({
  //           type: 'hour', length: 2, valueFrom: 0, valueTo: 23, value: ''
  //         })
  //         break
  //
  //       case 'i': // minute or second
  //         this.data.maskPart.push({
  //           type: 'minute', length: 2, valueFrom: 0, valueTo: 59, value: ''
  //         })
  //         break
  //     }
  //
  //     if ('nsr'.indexOf(maskTab[i][0])>-1) { // parameters types
  //       // handle part next to parameters
  //       if (parameters && parameters[1]!=='')
  //         this.data.maskPart.push({
  //           type: 'const', length: parameters[1].length, value: parameters[1]
  //         })
  //     }
  //
  //     if ('ymdhi'.indexOf(maskTab[i][0])>-1) { // no parameters types
  //       // handle part next to parameters
  //       const next = maskTab[i].substr(1)
  //       if (next!=='')
  //         this.data.maskPart.push({
  //           type: 'const', length: next.length, value: next
  //         })
  //     }
  //
  //   }
  //   //console.log(data.maskPart)
  //   _setValue(renderValue())
  //
  // }
  //
  // // prop value change
  // _changeValue() {
  //   this._config.value && typeof this._config.value === 'string' && updateValue(this._config.value, 0)
  // }

  // restore cursor position
  // _restoreCursor() {
  //   //console.log(inputRef, ref)
  //   const input = inputRef.current
  //   if (input) {
  //     input.selectionStart = data.cursorPos
  //     input.selectionEnd = data.cursorPos
  //   }
  // }

  // Events

  // on change input handler
  _onChange(e) {
    //console.log(e)
    const value = e.target.value
    //console.log(value)
    const cursorPos = e.target.selectionStart||0
    const render = updateValue(value, cursorPos)
    if (render!=_value) {
      // on change user action
      console.log('check: ', checkValue())
      this._config.onChange && this._config.onChange(e)
    }
  }

  // on blur input handler
  // _onBlur(e: FocusEvent<HTMLInputElement>) {
  //   //console.log('blur')
  //   data.cursorPos = null
  //   onBlur && onBlur(e)
  // }


  // Static

  static initComponent(element, config, par) {
    // let data = Data.getData(element, DATA_KEY)
    // if (!data) {
    //   data = typeof config === 'object' ? new MultiSelect(element, config) : new MultiSelect(element)
    // }
    const data = DataPicker.getOrCreateInstance(this)
    if (typeof config === 'string') {
      const method = config
      if (typeof data[method] === 'undefined') {
        throw new TypeError(`No method named "${method}"`)
      }
      // eslint-disable-next-line default-case
      switch (method){
        case 'update':
        data[method](par)
        break;
        // case 'search':
        // data[method]('')
        // break;
        case 'dispose':
        // case 'show':
        // case 'hide':
        data[method]()
        break;
      }
    }
  }

  // function for jquery
  // static jQueryInterface(config) {
  //   return this.each(function () {
  //     const data = Button.getOrCreateInstance(this)
  //
  //     if (config === 'toggle') {
  //       data[config]()
  //     }
  //   })
  // }
  static jQueryInterface(config, par) {
    return this.each(function () {
      DataPicker.initComponent(this, config, par);
    })
  }

}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

// automatically components init based on class
EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
  // eslint-disable-next-line unicorn/prefer-spread
  Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
    DataPicker.initComponent(element, Manipulator.getDataAttributes(element))
  })
})

// EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, event => {
//   event.preventDefault()
//
//   const button = event.target.closest(SELECTOR_DATA_TOGGLE)
//   const data = Button.getOrCreateInstance(button)
//
//   data.toggle()
// })

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .data-picker to jQuery only if jQuery is present
 */

defineJQueryPlugin(DataPicker)

export default DataPicker
