/**
 * --------------------------------------------------------------------------
 * CoreUI (v3.?): datatable.js
 * Licensed under MIT (https://coreui.io/license)
 * --------------------------------------------------------------------------
 */

import {
  getjQuery,
  getElementFromSelector,
  typeCheckConfig,
  findRep,
  objStr
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

const NAME = 'datatable'
const VERSION = '3.2.2'
const DATA_KEY = 'coreui.datatable'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

// zmienne
const SELECTOR_COMPONENT = '[data-coreui="datatable"]'

const SELECTOR_LIST = '[data-list]'
const SELECTOR_INPUT = 'input'
const SELECTOR_TAGS = '.c-tag-area'
const SELECTOR_TAG_DEL = '.c-tag button'

const EVENT_OPEN = `open${EVENT_KEY}`//u
const EVENT_CLOSE = `close${EVENT_KEY}`//u
const EVENT_SEARCH = `search${EVENT_KEY}`//u
const EVENT_FOCUS = `focus${EVENT_KEY}`//u
const EVENT_BLUR = `blur${EVENT_KEY}`//u
const EVENT_CHANGE = `keyup${EVENT_KEY}`//u
const EVENT_CLICK = `click${EVENT_KEY}`//u

//?
const TAG_LIST = 'UL'//u
const TAG_ITEM = 'LI'//u

const CLASSNAME_MULTI_SELECT = 'c-datatable'
const CLASSNAME_TAG = 'c-tag'
const CLASSNAME_LABEL = 'c-label'

//jquery
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`//?

const DefaultType = {
  items: 'array',
  fields: 'array',
  itemsPerPage: 'number',
  activePage: 'number',
  pagination: ['boolean', 'object'],
  addTableClasses: ['string', 'array', 'object'],
  responsive: 'boolean',
  size: 'string',
  dark: 'boolean',
  striped: 'boolean',
  fixed: 'boolean',
  hover: 'boolean',
  border: 'boolean',
  outlined: 'boolean',
  itemsPerPageSelect: ['boolean', 'object'],
  sorter: ['boolean', 'object'],
  tableFilter: ['boolean', 'object'],
  columnFilter: ['boolean', 'object'],
  sorterValue: 'object',
  tableFilterValue: 'string',
  columnFilterValue: 'object',
  header: 'boolean',
  footer: 'boolean',
  loading: 'boolean',
  clickableRows: 'boolean',
  noItemsView: 'object',
  cleaner: 'boolean'
}

const Default = {
  itemsPerPage: 10,
  responsive: true,
  sorterValue: () => { return {} },
  header: true,
  columnFilterSlot: [],
  columnHeaderSlot: []
}


/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Datatable {
  constructor(element, config) {

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
      tableFilterState: this._tableFilterValue,
      columnFilterState: {},
      sorterState: {
        column: null,
        asc: true
      },
      page: this._activePage || 1,
      perPageItems: this._itemsPerPage,
      passedItems: this._items || []
    }
    })()
    for (let key in data)
      this['_'+key] = data[key];


    // init

    this._templates = [];
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

    //

    // template, this.template

    /*
    this.a = 6;
    this.a1 = 8;
    this.b = 4;
    this.tablica = [1,4,5];
    this.columnFilterState = [];
    */

    this._global = {
      icons:{
        cilFilterX:1
      }
    }

    //***

    let replace = {};
    this._generatedColumnNames = ( ()=> {
      return Object.keys(this._passedItems[0] || {}).filter(el => el.charAt(0) !== '_')
    })();

	this._rawColumnNames = ( ()=> {
      if (this._fields) {
        return this._fields.map(el => el.key || el)
      }
      return this._generatedColumnNames
    })();

	this._columnFiltered = ( ()=> {
      let items = this._passedItems
      if (this._columnFilter && this._columnFilter.external) {
        return items
      }
      Object.entries(this._columnFilterState).forEach(([key, value]) => {
        const columnFilter = String(value).toLowerCase()
        if (columnFilter && this._rawColumnNames.includes(key)) {
          items = items.filter(item => {
            return String(item[key]).toLowerCase().includes(columnFilter)
          })
        }
      })
      return items
    })();

	this._itemsDataColumns = ( ()=> {
      return this._rawColumnNames.filter(name => {
        return this._generatedColumnNames.includes(name)
      })
    })();

	this._tableFiltered = ( ()=> {
      let items = this._columnFiltered
      if (!this._tableFilterState || (this._tableFilter && this._tableFilter.external)) {
        return items
      }
      const filter = this._tableFilterState.toLowerCase()
      const hasFilter = (item) => String(item).toLowerCase().includes(filter)
      items = items.filter(item => {
        return this._itemsDataColumns.filter(key => hasFilter(item[key])).length
      })
      return items
    })();

	this._sortedItems = ( ()=> {
      const col = this._sorterState.column
      if (!col || !this._rawColumnNames.includes(col) || this._sorter.external) {
        return this._tableFiltered
      }
      //if values in column are to be sorted by numeric value they all have to be type number
      const flip = this._sorterState.asc ? 1 : -1
      return this._tableFiltered.slice().sort((item, item2) => {
        const value  = item[col]
        const value2 = item2[col]
        const a = typeof value === 'number' ? value : String(value).toLowerCase()
        const b = typeof value2 === 'number' ? value2 : String(value2).toLowerCase()
        return a > b ? 1 * flip : b > a ? -1 * flip : 0
      })
    })();

	this._computedPage = ( ()=> {
      return this._pagination ? this._page : this._activePage
    })();

	this._firstItemIndex = ( ()=> {
      return (this._computedPage - 1) * this._perPageItems || 0
    })();

	this._paginatedItems = ( ()=> {
      return this._sortedItems.slice(
        this._firstItemIndex,
        this._firstItemIndex + this._perPageItems
      )
    })();

	this._currentItems = ( ()=> {
      return this._computedPage ? this._paginatedItems : this._sortedItems
    })();

	this._totalPages = ( ()=> {
      return Math.ceil((this._sortedItems.length)/ this._perPageItems) || 1
    })();

	this._columnNames = ( ()=> {
      if (this._fields) {
        return this._fields.map(f => {
          return f.label !== undefined ? f.label : this._pretifyName(f.key || f)
        })
      }
      return this._rawColumnNames.map(el => this._pretifyName(el))
    })();

	this._tableClasses = ( ()=> {
      return [
        'table',
        this._addTableClasses,
        {
          [`table-${this._size}`]: this._size,
          'table-dark': this._dark,
          'table-striped': this._striped,
          'table-fixed': this._fixed,
          'table-hover': this._hover,
          'table-bordered': this._border,
          'border': this._outlined
        }
      ]
    })();

	this._sortingIconStyles = ( ()=> {
      return {'position-relative pr-4' : this._sorter }
    })();

	this._colspan = ( ()=> {
      return this._rawColumnNames.length
    })();

	this._tableFilterData = ( ()=> {
      return {
        label: this._tableFilter.label || 'Filter:',
        placeholder: this._tableFilter.placeholder || 'type string...'
      }
    })();

	this._paginationSelect = ( ()=> {
      return {
        label: this._itemsPerPageSelect.label || 'Items per page:',
        values: this._itemsPerPageSelect.values || [5, 10, 20, 50]
      }
    })();

	this._noItemsText = ( ()=> {
      const customValues = this._noItemsView || {}
      if (this._passedItems.length) {
        return customValues.noResults || 'No filtering results'
      }
      return customValues.noItems || 'No items'
    })();

	this._isFiltered = ( ()=> {
      return this._tableFilterState ||
             Object.values(this._columnFilterState).join('') ||
             this._sorterState.column
    })();

	this._cleanerProps = ( ()=> {
      return {
        content: this._global.icons.cilFilterX,
        class: `ml-2 ${this._isFiltered ? 'text-danger' : 'transparent'}`,
        role: this._isFiltered ? 'button' : null,
        tabindex: this._isFiltered ? 0 : null,
      }
    })();

	this._haveFilterOption = ( ()=> {
      return this._tableFilter || this._cleaner || this._scopedSlots.cleaner
    })();


    if (this._itemsPerPage!==this._old_itemsPerPage) ( (val)=> {
      this._perPageItems = val
    })(this._itemsPerPage);
	this._old_itemsPerPage = this._itemsPerPage;

	if (this._sorterValue!==this._old_sorterValue) ( (val)=> {
        const asc = val.asc === false ? false : true
        this._sorterState = Object.assign({}, { asc, column: val.column })
      })(this._sorterValue);
	this._old_sorterValue = this._sorterValue;

	if (this._tableFilterValue!==this._old_tableFilterValue) ( (val)=> {
      this._tableFilterState = val
    })(this._tableFilterValue);
	this._old_tableFilterValue = this._tableFilterValue;

	if (this._columnFilterValue!==this._old_columnFilterValue) ( (val)=> {
        this._columnFilterState = Object.assign({}, val)
      })(this._columnFilterValue);
	this._old_columnFilterValue = this._columnFilterValue;

	if (this._items!==this._old_items) ( (val, oldVal)=> {
      if (val && oldVal && this._objectsAreIdentical(val, oldVal)) {
        return
      }
      this._passedItems = val || []
    })(this._items);
	this._old_items = this._items;

	if (this._totalPages!==this._old_totalPages) ( (val)=> {
        this._emitEvent('pages-change', val)
      })(this._totalPages);
	this._old_totalPages = this._totalPages;

	if (this._computedPage!==this._old_computedPage) ( (val)=> {
      this._emitEvent('page-change', val)
    })(this._computedPage);
	this._old_computedPage = this._computedPage;

	if (this._sortedItems!==this._old_sortedItems) ( (val, oldVal)=> {
        if (val && oldVal && this._objectsAreIdentical(val, oldVal)) {
          return
        }
        this._emitEvent('filtered-items-change', val)
      })(this._sortedItems);
	this._old_sortedItems = this._sortedItems;



 		replace['exp'] =
        (par)=>{return htmlRepStr(this._tableFilterData.label, par)};

 		replace['exp-2'] =
        (par)=>{return htmlRepStr(this._tableFilterData.placeholder, par)};

		replace['filter-input'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'keyup',
            f: (event)=>this._onFilterInputEvent(event, par)
          }
          return 'coreui-event="'+eventN+'"';
        };

		replace['filter-change'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'change',
            f: (event)=>this._onFilterChangeEvent(event, par)
          }
          return 'coreui-event="'+eventN+'"';
        };

//filter part
 		replace['filter'] =
        (par)=>{
          if (this._tableFilter) return htmlRep(`
          <label class="mr-2">{exp}</label>
          <input
            class="form-control"
            type="text"
            placeholder="{exp-2}"
            {filter-input}
            {filter-change}
            value=""
            aria-label="table filter input"
          >
        `, par);
          return ''
        };

 		replace['exp-3'] =
        (par)=>{return htmlRepStr(this._cleanerProps, par)};

		replace['cleaner-click'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'click',
            f: (event)=>this._onCleanerClickEvent(event, par)
          }
          return 'coreui-event="'+eventN+'"';
        };

 		replace['val'] =
        (par)=>{
          if (this._cleaner && typeof this._cleaner === 'function') return htmlRepStr(this._cleaner({clean:this._clean, isFiltered:this._isFiltered}), par);
          else if (this._cleaner) return htmlRepStr(this._cleaner, par);
          else return htmlRep(`
          <i
            class=""
            {exp-3}
            {cleaner-click}
          ></i>
        `, par);
        };

//cleaner
		replace['cleaner'] =
        (par)=>{
          if (this._cleaner) return htmlRep(`
        {val}
        `, par);
          return ''
        };

 		replace['filter-option'] =
        (par)=>{
          if (this._haveFilterOption) return htmlRep(`
      <div
        class="col-sm-6 form-inline p-0"
      >
        {filter}
        {cleaner}

      </div>
      `, par);
          return ''
        };

 		replace['exp-4'] =
        (par)=>{return htmlRepStr(!this._haveFilterOption ? 'offset-sm-6' : '', par)};

 		replace['exp-5'] =
        (par)=>{return htmlRepStr(this._paginationSelect.label, par)};

		replace['pagination-change'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'change',
            f: (event)=>this._onPaginationChangeEvent(event, par)
          }
          return 'coreui-event="'+eventN+'"';
        };

 		replace['exp-6'] =
        (par)=>{return htmlRepStr(this._perPageItems, par)};

 		replace['tymcz'] =
        (par)=>{
          let code = '';
          for (let idx in this._paginationSelect.values){
            par['key'] = idx;
            par['number'] = this._paginationSelect.values[idx];
            code+=htmlRep(`
            <option
              val="{:number}"
              key="{:key}"
            >
              {:number}
            </option>
            `, {...par});
          }
          return code;
        };

		replace['items-select'] =
        (par)=>{
          if (this._itemsPerPageSelect) return htmlRep(`
      <div
        class="col-sm-6 p-0 {exp-4}"
      >
        <div class="form-inline justify-content-sm-end">
          <label class="mr-2">{exp-5}</label>
          <select
            class="form-control"
            {pagination-change}
            aria-label="changes number of visible items"
          >
            <option value="" selected disabled hidden>
              {exp-6}
            </option>
            {tymcz}
          </select>
        </div>
      </div>
      `, par);
          return ''
        };

//search options
 		replace['options'] =
        (par)=>{
          if (this._itemsPerPageSelect || this._haveFilterOption) return htmlRep(`
    <div
      class="row my-2 mx-0"
    >
      {filter-option}

      {items-select}
    </div>
    `, par);
          return ''
        };

 		replace['over-table'] =
        (par)=>{return htmlRepStr(this._overTableSlot, par)};

		replace['responsive'] =
        (par)=>{return htmlRepStr(this._responsive ? 'table-responsive' : '', par)};

 		replace['table-classes'] =
        (par)=>{return htmlRepStr(this._tableClasses, par)};

 		replace['header-top'] =
        (par)=>{return htmlRepStr(this._theadTopSlot, par)};

 		replace['sort-click'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'click',
            f: (event)=>this._onSortClickEvent(event, par)
          }
          return 'coreui-event="'+eventN+'"';
        };

 		replace['exp-7'] =
        (par)=>{return htmlRepStr(this._headerClass(par["index"]), par)};

 		replace['exp-8'] =
        (par)=>{return htmlRepStr(this._sortingIconStyles, par)};

 		replace['exp-9'] =
        (par)=>{return htmlRepStr(this._headerStyles(par["index"]), par)};

		replace['val-2'] =
        (par)=>{
          if (this._columnHeaderSlot[this._rawColumnNames[par["index"]]] && typeof this._columnHeaderSlot[this._rawColumnNames[par["index"]]] === 'function') return htmlRepStr(this._columnHeaderSlot[this._rawColumnNames[par["index"]]](), par);
          else if (this._columnHeaderSlot[this._rawColumnNames[par["index"]]]) return htmlRepStr(this._columnHeaderSlot[this._rawColumnNames[par["index"]]], par);
          else return htmlRep(`
                  <div>{:name}</div>
                `, par);
        };

 		replace['exp-10'] =
        (par)=>{return htmlRepStr(this._iconClasses(par["index"]), par)};

 		replace['val-3'] =
        (par)=>{
          if (this._sortingIcon && typeof this._sortingIcon === 'function') return htmlRepStr(this._sortingIcon({state:getIconState(par["index"]), classes:this._iconClasses(par["index"])}), par);
          else if (this._sortingIcon) return htmlRepStr(this._sortingIcon, par);
          else return htmlRep(`
                  <i
                    class="cil-arrow-top {exp-10}"
                    aria-label="change column: '{:name}' sorting"
                  ></i>
                `, par);
        };

 		replace['sortable'] =
        (par)=>{
          if (this._isSortable(par["index"])) return htmlRep(`
                {val-3}
                `, par);
          return ''
        };

 		replace['table-header'] =
        (par)=>{
          let code = '';
          for (let idx in this._columnNames){
            par['index'] = idx;
            par['name'] = this._columnNames[idx];
            code+=htmlRep(`
              <th
                {sort-click}
                class="{exp-7} {exp-8}"
                style="{exp-9}"
                key="{:index}"
              >
                {val-2}
                {sortable}
              </th>
            `, {...par});
          }
          return code;
        };

 		replace['header'] =
        (par)=>{
          if (this._header) return htmlRep(`
          <tr>
            {table-header}
          </tr>
          `, par);
          return ''
        };

		replace['exp-11'] =
        (par)=>{return htmlRepStr(this._headerClass(par["index"]), par)};

 		replace['column-filter-input'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'keyup',
            f: (event)=>this._onColumnFilterInputEvent(event, par)
          }
          return 'coreui-event="'+eventN+'"';
        };

 		replace['column-filter-change'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'change',
            f: (event)=>this._onColumnFilterChangeEvent(event, par)
          }
          return 'coreui-event="'+eventN+'"';
        };

		replace['fields'] =
        (par)=>{
          if (!this._fields || this._fields[par["index"]].filter!==false) return htmlRep(`
                  <input
                    class="form-control form-control-sm"
                    {column-filter-input}
                    {column-filter-change}
                    value=""
                    aria-label="column name: '{:colName}' filter input"
                  />
                  `, par);
          return ''
        };

 		replace['val-4'] =
        (par)=>{
          if (this._columnFilterSlot[this._rawColumnNames[par["index"]]] && typeof this._columnFilterSlot[this._rawColumnNames[par["index"]]] === 'function') return htmlRepStr(this._columnFilterSlot[this._rawColumnNames[par["index"]]](), par);
          else if (this._columnFilterSlot[this._rawColumnNames[par["index"]]]) return htmlRepStr(this._columnFilterSlot[this._rawColumnNames[par["index"]]], par);
          else return htmlRep(`
                  {fields}
                `, par);
        };

 		replace['tymcz2'] =
        (par)=>{
          let code = '';
          for (let idx in this._rawColumnNames){
            par['index'] = idx;
            par['colName'] = this._rawColumnNames[idx];
            code+=htmlRep(`
              <th class="{exp-11}" key="{:index}">
                {val-4}
              </th>
            `, {...par});
          }
          return code;
        };

 		replace['column-filter'] =
        (par)=>{
          if (this._columnFilter) return htmlRep(`
          <tr class="table-sm">
            {tymcz2}
          </tr>
          `, par);
          return ''
        };

 		replace['clicable'] =
        (par)=>{return htmlRepStr(this._clickableRows ? 'cursor:pointer;': null, par)};

		replace['row-click'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'click',
            f: (event)=>this._onRowClickEvent(event, par)
          }
          return 'coreui-event="'+eventN+'"';
        };

 		replace['exp-12'] =
        (par)=>{return htmlRepStr(par["item"]._classes, par)};

 		replace['exp-13'] =
        (par)=>{return htmlRepStr(this._clickableRows ? 0 : null, par)};

 		replace['val-5'] =
        (par)=>{
          if (this._scopedSlots[par["colName"]] && typeof this._scopedSlots[par["colName"]] === 'function') return htmlRepStr(this._scopedSlots[par["colName"]]({item:par["item"], index:par["itemIndex"]+this._firstItemIndex}), par);
          else if (this._scopedSlots[par["colName"]]) return htmlRepStr(this._scopedSlots[par["colName"]], par);
          else return htmlRep(`
                `, par);
        };

 		replace['exp-14'] =
        (par)=>{return htmlRepStr(this._cellClass(par["item"], par["colName"], par["index"]), par)};

 		replace['exp-15'] =
        (par)=>{return htmlRepStr(String(par["item"][par["colName"]]), par)};

		replace['scoped'] =
        (par)=>{
          if (this._scopedSlots[par["colName"]]) return htmlRep(`
                {val-5}
                `, par)
          return htmlRep(`
                <td
                  class="{exp-14}"
                  key="{:index}"
                >
                  {exp-15}
                </td>
                `, par)
        };

 		replace['tymcz3'] =
        (par)=>{
          let code = '';
          for (let idx in this._rawColumnNames){
            par['index'] = idx;
            par['colName'] = this._rawColumnNames[idx];
            code+=htmlRep(`
                {scoped}
              `, {...par});
          }
          return code;
        };

 		replace['details-row-click'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'click',
            f: (event)=>this._onDetailsRowClickEvent(event, par)
          }
          return 'coreui-event="'+eventN+'"';
        };

 		replace['exp-16'] =
        (par)=>{return htmlRepStr(this._colspan, par)};

 		replace['val-6'] =
        (par)=>{
          if (this._scopedSlots['details'] && typeof this._scopedSlots['details'] === 'function') return htmlRepStr(this._scopedSlots['details']({item:par["item"], index:par["itemIndex"]+this._firstItemIndex}), par);
          else if (this._scopedSlots['details']) return htmlRepStr(this._scopedSlots['details'], par);
          else return htmlRep(`
                `, par);
        };

 		replace['details'] =
        (par)=>{
          if (this._scopedSlots.details) return htmlRep(`
            <tr
              {details-row-click}
              class="p-0"
              style="border:none !important"
              key="details{:itemIndex}"
            >
              <td
                colspan="{exp-16}"
                class="p-0"
                style="border:none !important"
              >
                {val-6}
              </td>
            </tr>
            `, par);
          return ''
        };

 		replace['table'] =
        (par)=>{
          let code = '';
          for (let idx in this._currentItems){
            par['itemIndex'] = idx;
            par['item'] = this._currentItems[idx];
            code+=htmlRep(`
            <tr
              {row-click}
              class="{exp-12}"
              tabindex="{exp-13}"
              key="{:itemIndex}"
            >
              {tymcz3}
            </tr>
            {details}
          `, {...par});
          }
          return code;
        };

		replace['exp-17'] =
        (par)=>{return htmlRepStr(this._colspan, par)};

 		replace['exp-18'] =
        (par)=>{return htmlRepStr(this._noItemsText, par)};

 		replace['val-7'] =
        (par)=>{
          if (this._noItemsViewSlot && typeof this._noItemsViewSlot === 'function') return htmlRepStr(this._noItemsViewSlot(), par);
          else if (this._noItemsViewSlot) return htmlRepStr(this._noItemsViewSlot, par);
          else return htmlRep(`
                <div class="text-center my-5">
                  <h2>
                    {exp-18}
                    <i
                      class="cil-ban text-danger mb-2"
                      width="30"
                    ></i>
                  </h2>
                </div>
              `, par);
        };

 		replace['no-items'] =
        (par)=>{
          if (!this._currentItems.length) return htmlRep(`
          <tr>
            <td colspan={exp-17}>
              {val-7}
            </td>
          </tr>
          `, par);
          return ''
        };

		replace['sort-footer-click'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'click',
            f: (event)=>this._onSortFooterClickEvent(event, par)
          }
          return 'coreui-event="'+eventN+'"';
        };

 		replace['exp-19'] =
        (par)=>{return htmlRepStr(this._headerClass(par["index"]), par)};

 		replace['exp-20'] =
        (par)=>{return htmlRepStr(this._sortingIconStyles, par)};

 		replace['exp-21'] =
        (par)=>{return htmlRepStr(this._headerStyles(par["index"]), par)};

 		replace['val-8'] =
        (par)=>{
          if (this._columnHeaderSlot[this._rawColumnNames[par["index"]]] && typeof this._columnHeaderSlot[this._rawColumnNames[par["index"]]] === 'function') return htmlRepStr(this._columnHeaderSlot[this._rawColumnNames[par["index"]]](), par);
          else if (this._columnHeaderSlot[this._rawColumnNames[par["index"]]]) return htmlRepStr(this._columnHeaderSlot[this._rawColumnNames[par["index"]]], par);
          else return htmlRep(`
                  <div>{:name}</div>
                `, par);
        };

 		replace['exp-22'] =
        (par)=>{return htmlRepStr(this._iconClasses(par["index"]), par)};

 		replace['val-9'] =
        (par)=>{
          if (this._sortingIconSlot && typeof this._sortingIconSlot === 'function') return htmlRepStr(this._sortingIconSlot({state: this._getIconState(par["index"])}), par);
          else if (this._sortingIconSlot) return htmlRepStr(this._sortingIconSlot, par);
          else return htmlRep(`
                  <i
                    class="cil-arrow-top {exp-22}"
                    width="18"
                  }</i>
                `, par);
        };

 		replace['sortable-down'] =
        (par)=>{
          if (this._isSortable(par["index"])) return htmlRep(`
                {val-9}
                `, par);
          return ''
        };

 		replace['footer-row'] =
        (par)=>{
          let code = '';
          for (let idx in this._columnNames){
            par['index'] = idx;
            par['name'] = this._columnNames[idx];
            code+=htmlRep(`
              <th
                {sort-footer-click}
                class="{exp-19} {exp-20}"
                style="{exp-21}"
                key="{:index}"
              >
                {val-8}
                {sortable-down}
              </th>
            `, {...par});
          }
          return code;
        };

//footer part
		replace['footer'] =
        (par)=>{
          if (this._footer && this._currentItems.length>0) return htmlRep(`
        <tfoot coreui-part="footer">
        </tfoot>
        `, par);
          return ''
        };

		replace['footer-slot'] =
        (par)=>{
          if (this._footerSlot && typeof this._footerSlot === 'function') return htmlRepStr(this._footerSlot({itemsAmount: this._currentItems.length}), par);
          else if (this._footerSlot) return htmlRepStr(this._footerSlot, par);
          else return htmlRep(``, par);
        };

 		replace['caption'] =
        (par)=>{return htmlRepStr(this._captionSlot, par)};

		replace['val-10'] =
        (par)=>{
          if (this._loading && typeof this._loading === 'function') return htmlRepStr(this._loading(), par);
          else if (this._loading) return htmlRepStr(this._loading, par);
          else return htmlRep(``, par);
        };

 		replace['loading'] =
        (par)=>{
          if (this._loading) return htmlRep(`
      {val-10}
      `, par);
          return ''
        };

		replace['under-table'] =
        (par)=>{return htmlRepStr(this._underTableSlot, par)};

 		replace['com'] =
        (par)=>{
          compN++;
          comps[compN] = {
            compType: 'Pagination',
            props:      {
        style: !(this._totalPages > 1) ? 'style="display:none"' : '',
        activePage: this._page,
        pages: this._totalPages,
        paginationProps: typeof this._pagination === 'object' ? this._paginationProps : '',
        onChange: (n)=>{
          this._page = n;
          this._render();
        }
      }

          }
          return '<div coreui-comp="'+compN+'"></div>'
        };

		replace['pagination'] =
        (par)=>{
          if (this._pagination) return htmlRep(`
    {com}
    `, par);
          return ''
        };


      //

      this._template = `
      <div>
        <div coreui-part="options"></div>
        <div class="position-relative {responsive}">
          <table class="{table-classes}">
            <thead coreui-part="head"></thead>
            <tbody
              style={clicable}
              class="position-relative"
              coreui-part="body"
            ></tbody>
            {footer}
            {footer-slot}
            {caption}
          </table>
          <div coreui-part="loading"></div>
        </div>
        <div coreui-part="pagination"></div>
      </div>
    `;


    // parts

    this._templates['head'] = `
      {header-top}
      {header}
      {column-filter}
    `;

    this._templates['body'] = `
      {table}
      {no-items}
    `;

    this._templates['options'] = `
      {options}
      {over-table}
    `;

    this._templates['pagination'] = `
      {under-table}
      {pagination}
    `;

    this._templates['loading'] = `
      {loading}
    `;

    this._templates['footer'] = `
      <tr>
        {footer-row}
      </tr>
    `;


    // build

    //console.log(this._scopedSlots);

    let handlers = {};
    let comps = {};
    let eventN = 0;
    let compN = 0;

    let code = htmlRep(this._template, {});
    //console.log('code:');
    //console.log(code);

    let el;

    // render code part
    const renderPart = (part)=>{

      handlers = {};
      comps = {};
      eventN = 0;
      compN = 0;
      code = htmlRep(this._templates[part], {});

      //console.log('code part:'+part, code);

      if (code!==this._codes[part]){ //let m = md5(code)!==this._code['part']

        if (part==='options' && this._codes[part]){
          //console.log('code part old:'+part, this._codes[part]);
          //return;
        }

        //console.log('code part old:'+part, this._codes[part]);

        el = SelectorEngine.findOne('[coreui-part="'+part+'"]', this._element);
        if (!el)
          return;
        el.innerHTML = code;
        this._codes[part] = code;

        //events
        for (let id in handlers){
          el = SelectorEngine.findOne('[coreui-event="'+id+'"]', this._element);
          EventHandler.on(el, handlers[id].eventType+EVENT_KEY, handlers[id].f);
        }

        //components
        for (let id in comps){
          el = SelectorEngine.findOne('[coreui-comp="'+id+'"]', this._element);
          // init
          //console.log('comps', comps[id].props);
          let component = new coreui[comps[id].compType](el, comps[id].props);
        }

      }
      else{

        //components
        for (let id in comps){
          el = SelectorEngine.findOne('[coreui-comp="'+id+'"]', this._element);
          // update
          //console.log('comps update', comps[id].props);
          coreui[comps[id].compType].getInstance(el).update(comps[id].props);
        }

      }

    }

    if (code!==this._codes['main']){
      //insert main code
      this._element.innerHTML = code;
      this._codes = [];
      this._codes['main'] = code;

      //events
      for (let id in handlers){
        el = SelectorEngine.findOne('[coreui-event="'+id+'"]', this._element);
        EventHandler.on(el, handlers[id].eventType+EVENT_KEY, handlers[id].f);
      }

      //components
      for (let id in comps){
        el = SelectorEngine.findOne('[coreui-comp="'+id+'"]', this._element);
        // init
        let component = new coreui[comps[id].compType](el, comps[id].props);
      }
    }

    // render sub-parts

    renderPart('head');
    renderPart('body');
    renderPart('options');
    renderPart('pagination');
    renderPart('footer');
    renderPart('loading');


    //

    setTimeout(()=>{
      this._rendered();
    }, 1);

  }

  _rendered(){ // run after content is rendered
  }


  // methods

  _changeSort (column, index) {
        if (!this._isSortable(index)) {
          return
        }
        //if column changed or sort was descending change asc to true
        const state = this._sorterState
        const columnRepeated = state.column === column
        if (!this._sorter || !this._sorter.resetable) {
          state.column = column
        } else {
          state.column = columnRepeated && state.asc === false ? null : column
        }
        state.asc = !(columnRepeated && state.asc)
        this._emitEvent('update:sorter-value', this._sorterState)
        this._render()
      }
  _columnFilterEvent (colName, value, type) {
        const isLazy = this._columnFilter && this._columnFilter.lazy === true
        if (isLazy && type === 'input' || !isLazy && type === 'change') {
          return
        }
        //this._$set(this._columnFilterState, colName, value)
        this._columnFilterState = {...this._columnFilterState, [`${colName}`]: value }
        this._emitEvent('update:column-filter-value', this._columnFilterState)
        this._render()
      }
  _tableFilterChange (value, type) {
        const isLazy = this._tableFilter && this._tableFilter.lazy === true
        if (isLazy && type === 'input' || !isLazy && type === 'change') {
          return
        }
        this._tableFilterState = value
        this._emitEvent('update:table-filter-value', this._tableFilterState)
        this._render()
      }
  _pretifyName (name) {
        return name.replace(/[-_.]/g, ' ')
          .replace(/ +/g, ' ')
          .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      }
  _cellClass (item, colName, index) {
        let classes = []
        if (item._cellClasses && item._cellClasses[colName]) {
          classes.push(item._cellClasses[colName])
        }
        if (this._fields && this._fields[index]._classes) {
          classes.push(this._fields[index]._classes)
        }
        return classes
      }
  _isSortable (index) {
        return this._sorter &&
               (!this._fields || this._fields[index].sorter !== false) &&
               this._itemsDataColumns.includes(this._rawColumnNames[index])
      }
  _headerClass (index) {
        const fields = this._fields
        return fields && fields[index]._classes ? fields[index]._classes : ''
      }
  _headerStyles (index) {
        let style = 'vertical-align:middle;overflow:hidden;'
        if (this._isSortable(index)) {
          style += `cursor:pointer;`
        }
        if (this._fields && this._fields[index] && this._fields[index]._style) {
          style += this._fields[index]._style
        }
        return style
      }
  _rowClicked (item, index, e, detailsClick = false) {
        this._emitEvent(
          'row-clicked', {item, index, columnName: this._getClickedColumnName(e, detailsClick)}
        )
      }
  _getClickedColumnName (e, detailsClick) {
        if (detailsClick) {
          return 'details'
        } else {
          if (!e.target.closest('tr'))
            return '';
          const children = Array.from(e.target.closest('tr').children)
          const clickedCell = children.filter(child => child.contains(e.target))[0]
          return this._rawColumnNames[children.indexOf(clickedCell)]
        }
      }
  _getIconState (index) {
        const direction = this._sorterState.asc ? 'asc' : 'desc'
        return this._rawColumnNames[index] === this._sorterState.column ? direction : 0
      }
  _iconClasses (index) {
        const state = this._getIconState(index)
        return [
          'icon-transition position-absolute arrow-position',
          {
            'transparent': !state,
            'rotate-icon': state === 'desc'
          }
        ]
      }
  _paginationChange (e) {
        this._emitEvent('pagination-change', Number(e.target.value))
        if (this._itemsPerPageSelect.external) {
          return
        }
        this._perPageItems = Number(e.target.value)
        this._render();
      }
  _objectsAreIdentical (obj1, obj2) {
        return obj1.length === obj2.length &&
               JSON.stringify(obj1) === JSON.stringify(obj2)
      }
  _clean() {
        this._tableFilterState = ""
        this._columnFilterState = {}
        this._sorterState = { column: "", asc: true }
      }



  // events

  _next(f){
    setTimeout(f,1);
  }

  /*
  _addEvent (eventType, f){
    let el = SelectorEngine.findOne('coreui-event="1"', this._element);
    eventType += EVENT_KEY;
    EventHandler.on(el, eventType, f);
  }
  */

  _emitEvent(type, value, element=document) { //c
    //console.log('emit', type, value);
    switch(type){
      //case 'update:sorter-value':
      //case 'update:column-filter-value':
      //case 'update:table-filter-value':
      //case 'pagination-change':
      //case 'pages-change':
      //case 'page-change':
      //case 'filtered-items-change':
      //this._render();
      //break;
      default:
      //row-clicked
      break;
    }
    type += EVENT_KEY;
    return EventHandler.trigger(element, type, value);
  }

  _onFilterInputEvent(event, par) {
  	this._tableFilterChange(event.target.value, 'input');
  	event.preventDefault();
  	event.stopPropagation();
  }

  _onFilterChangeEvent(event, par) {
  	this._tableFilterChange(event.target.value, 'change');
  	event.preventDefault();
  	event.stopPropagation();
  }

  _onPaginationChangeEvent(event, par) {
  	this._paginationChange(event);
  	event.preventDefault();
  	event.stopPropagation();
  }

  _onSortClickEvent(event, par) {
  	this._changeSort(this._rawColumnNames[par["index"]], par["index"]);
  	event.preventDefault();
  	event.stopPropagation();
  }

  _onColumnFilterInputEvent(event, par) {
  	this._columnFilterEvent(par["colName"], event.target.value, 'input');
  	event.preventDefault();
  	event.stopPropagation();
  }

  _onColumnFilterChangeEvent(event, par) {
  	this._columnFilterEvent(par["colName"], event.target.value, 'change');
  	event.preventDefault();
  	event.stopPropagation();
  }

  _onRowClickEvent(event, par) {
  	this._rowClicked(par["item"], par["itemIndex"] + this._firstItemIndex, event);
  	event.preventDefault();
  	event.stopPropagation();
  }

  _onDetailsRowClickEvent(event, par) {
  	this._rowClicked(par["item"], par["itemIndex"] + this._firstItemIndex, event, true);
  	event.preventDefault();
  	event.stopPropagation();
  }

  _onSortFooterClickEvent(event, par) {
  	this._changeSort(this._rawColumnNames[par["index"]], par["index"]);
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

    /*
    typeCheckConfig(
      NAME,
      config,
      this.constructor.DefaultType
    )
    */

    return config
  }


  // Public

  value() {
    return Object.keys(this._options);
  }


  // Static

  static jQueryInterface(config) {
    return this.each(function () {

      let data = Data.getData(this, DATA_KEY)

      if (!data) {
        data = new Datatable(this)
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

  render() {
    //alert('render');
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
      return new Datatable(element, config);
    }
    return data;
  }

  static destroy(element) { // remove instance connected to element
    let data = Data.getData(element, DATA_KEY)
    if (data) {
      if (element.parentNode) {
        element.parentNode.removeChild(element)
      }
      Datatable.destroyInstance(data);
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
 * add .datatable to jQuery only if jQuery is present
 */

/* istanbul ignore if */
if ($) {
  const JQUERY_NO_CONFLICT = $.fn[NAME]
  $.fn[NAME] = Datatable.jQueryInterface
  $.fn[NAME].Constructor = Datatable
  $.fn[NAME].noConflict = () => {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Datatable.jQueryInterface
  }
}

export default Datatable
