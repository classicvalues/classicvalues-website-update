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

    //check if exist

    if (Data.getData(element, DATA_KEY)) { // already found
      console.warn('Instance already exist.');
      return;
    }

    this._element = element

    this._options = {}

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
    this._templatePart = {};
    this._codes = [];
    this._userFocusElement = {part: '', idx: 0}


    // first render

    this._render();


    return;

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

    this._global = {
      icons:{
        cilFilterX:1
      }
    }

    //calculate variables
    this._calculate();


    //***

    let replace = {};

    // events

 		replace['sort-footer-click'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'click',
            f: (event)=>this._onSortFooterClick(event, par)
          }
          return 'coreui-event-click="'+eventN+'"';
        };

 		replace['details-row-click'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'click',
            f: (event)=>this._onDetailsRowClick(event, par)
          }
          return 'coreui-event-click="'+eventN+'"';
        };

		replace['row-click'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'click',
            f: (event)=>this._onRowClick(event, par)
          }
          return 'coreui-event-click="'+eventN+'"';
        };

		replace['column-filter-blur'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'blur',
            f: (event)=>this._onColumnFilterBlur(event, par)
          }
          return 'coreui-event-blur="'+eventN+'"';
        };

		replace['column-filter-focus'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'focus',
            f: (event)=>this._onColumnFilterFocus(event, par)
          }
          return 'coreui-event-focus="'+eventN+'"';
        };

 		replace['column-filter-change'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'change',
            f: (event)=>this._onColumnFilterChange(event, par)
          }
          return 'coreui-event-change="'+eventN+'"';
        };

 		replace['column-filter-input'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'keyup',
            f: (event)=>this._onColumnFilterInput(event, par)
          }
          return 'coreui-event-keyup="'+eventN+'"';
        };

 		replace['sort-click'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'click',
            f: (event)=>this._onSortClick(event, par)
          }
          return 'coreui-event-click="'+eventN+'"';
        };

		replace['pagination-change'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'change',
            f: (event)=>this._onPaginationChange(event, par)
          }
          return 'coreui-event-change="'+eventN+'"';
        };

 		replace['cleaner-click'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'click',
            f: (event)=>this._onCleanerClick(event, par)
          }
          return 'coreui-event-click="'+eventN+'"';
        };

 		replace['filter-blur'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'blur',
            f: (event)=>this._onFilterBlur(event, par)
          }
          return 'coreui-event-blur="'+eventN+'"';
        };

 		replace['filter-focus'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'focus',
            f: (event)=>this._onFilterFocus(event, par)
          }
          return 'coreui-event-focus="'+eventN+'"';
        };

 		replace['filter-change'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'change',
            f: (event)=>this._onFilterChange(event, par)
          }
          return 'coreui-event-change="'+eventN+'"';
        };

 		replace['filter-input'] =
        (par)=>{
          eventN++;
          handlers[eventN] = {
            eventType: 'keyup',
            f: (event)=>this._onFilterInput(event, par)
          }
          return 'coreui-event-keyup="'+eventN+'"';
        };

 		replace['filter-label'] =
        (par)=>{return htmlRepStr(this._tableFilterData.label, par)};

		replace['filter-placeholder'] =
        (par)=>{return htmlRepStr(this._tableFilterData.placeholder, par)};


		//filter part
 		replace['filter'] =
        (par)=>{
          if (this._tableFilter) return htmlRep(`
          <label class="mr-2">{filter-label}</label>
          <div coreui-part="filter-input">
            <input
              class="form-control"
              type="text"
              placeholder="{filter-placeholder}"
              {filter-input}
              {filter-change}
              {filter-focus}
              {filter-blur}
              value=""
              aria-label="table filter input"
            >
          </div>
        `, par);
          return ''
        };

 		replace['cleaner-props'] =
        (par)=>{return htmlRepStr(this._cleanerProps, par)};

		//cleaner
 		replace['cleaner'] =
          (par)=>getValue(this._cleaner, {clean:this._clean, isFiltered:this._isFiltered}, par, `
          <i
            class=""
            {cleaner-props}
            {cleaner-click}
          ></i>
        `);

 		replace['cleaner-con'] =
        (par)=>{
          if (this._cleaner) return htmlRep(`
        {cleaner}
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
        {cleaner-con}

      </div>
      `, par);
          return ''
        };

		//filter
 		replace['filter-options'] =
        (par)=>{return htmlRepStr(!this._haveFilterOption ? 'offset-sm-6' : '', par)};

 		replace['pagination-label'] =
        (par)=>{return htmlRepStr(this._paginationSelect.label, par)};

 		replace['page-items'] =
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
        class="col-sm-6 p-0 {filter-options}"
      >
        <div class="form-inline justify-content-sm-end">
          <label class="mr-2">{pagination-label}</label>
          <select
            class="form-control"
            {pagination-change}
            aria-label="changes number of visible items"
          >
            <option value="" selected disabled hidden>
              {page-items}
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

 		replace['header-class'] =
        (par)=>{return htmlRepStr(this._headerClass(par["index"]), par)};

		replace['sorting-styles'] =
        (par)=>{return htmlRepStr(this._sortingIconStyles, par)};

 		replace['header-styles'] =
        (par)=>{return htmlRepStr(this._headerStyles(par["index"]), par)};

 		replace['column-header-slot'] =
          (par)=>getValue(this._columnHeaderSlot[this._rawColumnNames[par["index"]]], null, par, `
                  <div>{:name}</div>
                `);

 		replace['icon-classes'] =
        (par)=>{return htmlRepStr(this._iconClasses(par["index"]), par)};

 		replace['sorting-icon'] =
          (par)=>getValue(this._sortingIcon, {state:this._getIconState(par["index"]), classes:this._iconClasses(par["index"])}, par, `
                  <i
                    class="cil-arrow-top {icon-classes}"
                    aria-label="change column: '{:name}' sorting"
                  ></i>
                `);

 		replace['sortable'] =
        (par)=>{
          if (this._isSortable(par["index"])) return htmlRep(`
                {sorting-icon}
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
                class="{header-class} {sorting-styles}"
                style="{header-styles}"
                key="{:index}"
              >
                {column-header-slot}
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

 		replace['header-class-2'] =
        (par)=>{return htmlRepStr(this._headerClass(par["index"]), par)};

		replace['part-column-input'] =
        (par)=>{
          if (!this._templatePart['part-column-input'])
            this._templatePart['part-column-input'] = [];
          this._templatePart['part-column-input'].push({
            html: `
                    <input
                      class="form-control form-control-sm"
                      {column-filter-input}
                      {column-filter-change}
                      {column-filter-focus}
                      {column-filter-blur}
                      value=""
                      aria-label="column name: '{:colName}' filter input"
                    />
                    `,
            par: par
          });
          return '';
        };

 		replace['fields'] =
        (par)=>{
          if (!this._fields || this._fields[par["index"]].filter!==false) return htmlRep(`
                  <div coreui-part="part-column-input">
                    {part-column-input}
                  </div>
                  `, par);
          return ''
        };

 		replace['column-slot'] =
          (par)=>getValue(this._columnFilterSlot[this._rawColumnNames[par["index"]]], null, par, `
                  {fields}
                `);

		replace['tymcz2'] =
        (par)=>{
          let code = '';
          for (let idx in this._rawColumnNames){
            par['index'] = idx;
            par['colName'] = this._rawColumnNames[idx];
            code+=htmlRep(`
              <th class="{header-class-2}" key="{:index}">
                {column-slot}
              </th>
            `, {...par});
          }
          return code;
        };

 		replace['part-column-filter'] =
        (par)=>{
          if (!this._templatePart['part-column-filter'])
            this._templatePart['part-column-filter'] = [];
          this._templatePart['part-column-filter'].push({
            html: `
            {tymcz2}
            `,
            par: par
          });
          return '';
        };

 		replace['column-filter'] =
        (par)=>{
          if (this._columnFilter) return htmlRep(`
          <tr class="table-sm" coreui-part="part-column-filter">
            {part-column-filter}
          </tr>
          `, par);
          return ''
        };

 		replace['clicable'] =
        (par)=>{return htmlRepStr(this._clickableRows ? 'cursor:pointer;': null, par)};

 		replace['exp'] =
        (par)=>{return htmlRepStr(par["item"]._classes, par)};

 		replace['tab-index'] =
        (par)=>{return htmlRepStr(this._clickableRows ? 0 : null, par)};

 		replace['scoped-slots'] =
          (par)=>getValue(this._scopedSlots[par["colName"]], {item:par["item"], index:par["itemIndex"]+this._firstItemIndex}, par, `
                `);

 		replace['cell-class'] =
        (par)=>{return htmlRepStr(this._cellClass(par["item"], par["colName"], par["index"]), par)};

 		replace['exp-2'] =
        (par)=>{return htmlRepStr(String(par["item"][par["colName"]]), par)};

		replace['scoped'] =
        (par)=>{
          if (this._scopedSlots[par["colName"]]) return htmlRep(`
                {scoped-slots}
                `, par)
          return htmlRep(`
                <td
                  class="{cell-class}"
                  key="{:index}"
                >
                  {exp-2}
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

		replace['colspan'] =
        (par)=>{return htmlRepStr(this._colspan, par)};

 		replace['scoped-slots-2'] =
          (par)=>getValue(this._scopedSlots['details'], {item:par["item"], index:par["itemIndex"]+this._firstItemIndex}, par, `
                `);

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
                colspan="{colspan}"
                class="p-0"
                style="border:none !important"
              >
                {scoped-slots-2}
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
              class="{exp}"
              tabindex="{tab-index}"
              key="{:itemIndex}"
            >
              {tymcz3}
            </tr>
            {details}
          `, {...par});
          }
          return code;
        };

 		replace['colspan-2'] =
        (par)=>{return htmlRepStr(this._colspan, par)};

		replace['no-item-text'] =
        (par)=>{return htmlRepStr(this._noItemsText, par)};

 		replace['no-item'] =
          (par)=>getValue(this._noItemsViewSlot, null, par, `
                <div class="text-center my-5">
                  <h2>
                    {no-item-text}
                    <i
                      class="cil-ban text-danger mb-2"
                      width="30"
                    ></i>
                  </h2>
                </div>
              `);

		replace['no-items'] =
        (par)=>{
          if (!this._currentItems.length) return htmlRep(`
          <tr>
            <td colspan={colspan-2}>
              {no-item}
            </td>
          </tr>
          `, par);
          return ''
        };

		replace['header-class-3'] =
        (par)=>{return htmlRepStr(this._headerClass(par["index"]), par)};

 		replace['exp-3'] =
        (par)=>{return htmlRepStr(this._sortingIconStyles, par)};

 		replace['header-style'] =
        (par)=>{return htmlRepStr(this._headerStyles(par["index"]), par)};

 		replace['column-header-slot-2'] =
          (par)=>getValue(this._columnHeaderSlot[this._rawColumnNames[par["index"]]], null, par, `
                  <div>{:name}</div>
                `);

		replace['icon-classes-2'] =
        (par)=>{return htmlRepStr(this._iconClasses(par["index"]), par)};

 		replace['sorting-icon-slot'] =
          (par)=>getValue(this._sortingIconSlot, {state: this._getIconState(par["index"])}, par, `
                  <i
                    class="cil-arrow-top {icon-classes-2}"
                    width="18"
                  }</i>
                `);

 		replace['sortable-down'] =
        (par)=>{
          if (this._isSortable(par["index"])) return htmlRep(`
                {sorting-icon-slot}
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
                class="{header-class-3} {exp-3}"
                style="{header-style}"
                key="{:index}"
              >
                {column-header-slot-2}
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
          <tr>
            {footer-row}
          </tr>
          `, par);
          return ''
        };

 		replace['footer-slot'] =
          (par)=>getValue(this._footerSlot, {itemsAmount: this._currentItems.length}, par, ``);

		replace['caption'] =
        (par)=>{return htmlRepStr(this._captionSlot, par)};

		replace['loading'] =
          (par)=>getValue(this._loading, null, par, ``);

		replace['loading-2'] =
        (par)=>{
          if (this._loading) return htmlRep(`
      {loading}
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
            <tfoot coreui-part="foot"></tfoot>
            {footer-slot}
            {caption}
          </table>
          <div coreui-part="loading"></div>
        </div>
        <div coreui-part="pagination"></div>
      </div>
    `;

    this._templatePart = {};

    this._templatePart['head'] = [{par:{}, html:`
      {header-top}
      {header}
      {column-filter}
    `}];

    this._templatePart['body'] = [{par:{}, html:`
      {table}
      {no-items}
    `}];

    this._templatePart['options'] = [{par:{}, html:`
      {options}
      {over-table}
    `}];

    this._templatePart['pagination'] = [{par:{}, html:`
      {under-table}
      {pagination}
    `}];

    this._templatePart['loading'] = [{par:{}, html:`
      {loading}
    `}];

    this._templatePart['foot'] = [{par:{}, html:`
      {footer}
    `}];


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

    const renderPartDyn = (part, idx)=>{

      handlers = {};
      comps = {};
      eventN = 0;
      compN = 0;

      //for (let name in this._templatePart[part][idx])
      //  last

      let par = this._templatePart[part][idx].par;
      par['.part'] = part;
      par['.idx'] = idx;
      code = htmlRep(this._templatePart[part][idx].html, par);
      //console.log('code part:'+part, code);

      let el, elMod;

      if (!this._codes[part] || code!==this._codes[part][idx]){ //let m = md5(code)!==this._code['part']

        if (part==='head'){
          console.log('dif');
          if (this._codes[part]) console.log(this._codes[part][idx]);
          console.log(this._codes[part] ? this._codes[part][idx] : 'no', code);
        }

        if (this._codes[part] &&
          this._userFocusElement &&
          this._userFocusElement.part===part &&
          this._userFocusElement.idx===idx)
          return false;

        if  (!this._codes[part])
          this._codes[part] = [];

        el = SelectorEngine.find('[coreui-part="'+part+'"]', this._element);
        if (el.length===0)
          return false;
        el = el[idx];

        //console.log('rendered', part);

        el.innerHTML = code;
        this._codes[part][idx] = code;

        //for (let name in newTemplatePart)

        switch (part) {
          case 'head':
            this._codes['part-column-filter'] = null;
            break;
          case 'part-column-filter':
          this._codes['part-column-input'] = null;
            break;
        }

        //events
        for (let id in handlers){
          elMod = SelectorEngine.findOne('[coreui-event-'+handlers[id].eventType+'="'+id+'"]', el);
          //console.log('aaa', elMod, id, handlers[id]);
          EventHandler.on(elMod, handlers[id].eventType+EVENT_KEY, handlers[id].f);
          //EventHandler.on(elMod, handlers[id].eventType+EVENT_KEY, (function(id, part, idx){return function(event){handlers[id].f(event, part, idx)}})(id, part, idx) );
        }

        //components
        for (let id in comps){
          elMod = SelectorEngine.findOne('[coreui-comp="'+id+'"]', el);
          // init
          //console.log('comps', comps[id].props);
          let component = new coreui[comps[id].compType](elMod, comps[id].props);
        }

      }
      else{

        //console.log('ommited render', part);

        el = SelectorEngine.find('[coreui-part="'+part+'"]', this._element);
        if (el.length===0)
          return false;
        el = el[idx];

        //components
        for (let id in comps){
          elMod = SelectorEngine.findOne('[coreui-comp="'+id+'"]', el);
          // update
          //console.log('comps update', elMod, comps[id].props);
          coreui[comps[id].compType].getInstance(elMod).update(comps[id].props);
        }

      }

      return true;

    }


    if (code!==this._codes['main']){

      //console.log('rendered main');
      //console.log(code)
      //console.log(this._codes['main'])

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

    // render sub-parts
    /*
    renderPart('options');
    renderPart('head');
    renderPart('body');
    renderPart('foot');
    renderPart('loading');
    renderPart('pagination');
    */

    //console.log('_templatePart', this._templatePart);

    let rendered = {};
    let next = true;
    while (next){
      next = false;
      for (let part in this._templatePart){
        //console.log(part);
        if (rendered[part]) continue;
        rendered[part] = true;
        for (let i=0; i<this._templatePart[part].length; i++){
          //console.log(this._templatePart[part][i].html);
          if (renderPartDyn(part, i)) next = true;
        }
      }
    }

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
  _calculate() {
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
        })(this._itemsPerPage, this._old_itemsPerPage);
    	this._old_itemsPerPage = this._itemsPerPage;

    	if (this._sorterValue!==this._old_sorterValue) ( (val)=> {
            const asc = val.asc === false ? false : true
            this._sorterState = Object.assign({}, { asc, column: val.column })
          })(this._sorterValue, this._old_sorterValue);
    	this._old_sorterValue = this._sorterValue;

    	if (this._tableFilterValue!==this._old_tableFilterValue) ( (val)=> {
          this._tableFilterState = val
        })(this._tableFilterValue, this._old_tableFilterValue);
    	this._old_tableFilterValue = this._tableFilterValue;

    	if (this._columnFilterValue!==this._old_columnFilterValue) ( (val)=> {
            this._columnFilterState = Object.assign({}, val)
          })(this._columnFilterValue, this._old_columnFilterValue);
    	this._old_columnFilterValue = this._columnFilterValue;

    	if (this._items!==this._old_items) ( (val, oldVal)=> {
          if (val && oldVal && this._objectsAreIdentical(val, oldVal)) {
            return
          }
          this._passedItems = val || []
        })(this._items, this._old_items);
    	this._old_items = this._items;

    	if (this._totalPages!==this._old_totalPages) ( (val)=> {
            this._emitEvent('pages-change', val)
          })(this._totalPages, this._old_totalPages);
    	this._old_totalPages = this._totalPages;

    	if (this._computedPage!==this._old_computedPage) ( (val)=> {
          this._emitEvent('page-change', val)
        })(this._computedPage, this._old_computedPage);
    	this._old_computedPage = this._computedPage;

    	if (this._sortedItems!==this._old_sortedItems) ( (val, oldVal)=> {
            if (val && oldVal && this._objectsAreIdentical(val, oldVal)) {
              return
            }
            this._emitEvent('filtered-items-change', val)
          })(this._sortedItems, this._old_sortedItems);
    	this._old_sortedItems = this._sortedItems;

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

  _onFilterInput(event, par) {
  	this._tableFilterChange(event.target.value, 'input');
  	event.preventDefault();
  	event.stopPropagation();
  }

  _onFilterChange(event, par) {
  	this._tableFilterChange(event.target.value, 'change');
  	event.preventDefault();
  	event.stopPropagation();
  }

  _onFilterFocus(event, par) {
  	//alert('focus')
  	this._userFocusElement = {
            part: par['.part'],
            idx: par['.idx']
          };
  	event.preventDefault();
  	event.stopPropagation();
  }

  _onFilterBlur(event, par) {
  	//alert('blur')
  	this._userFocusElement = null;
  	event.preventDefault();
  	event.stopPropagation();
  }

  _onCleanerClick(event, par) {
  	this._clean(event);
  	event.preventDefault();
  	event.stopPropagation();
  }

  _onPaginationChange(event, par) {
  	this._paginationChange(event);
  	event.preventDefault();
  	event.stopPropagation();
  }

  _onSortClick(event, par) {
  	this._changeSort(this._rawColumnNames[par["index"]], par["index"]);
  	event.preventDefault();
  	event.stopPropagation();
  }

  _onColumnFilterInput(event, par) {
  	this._columnFilterEvent(par["colName"], event.target.value, 'input');
  	event.preventDefault();
  	event.stopPropagation();
  }

  _onColumnFilterChange(event, par) {
  	this._columnFilterEvent(par["colName"], event.target.value, 'change');
  	event.preventDefault();
  	event.stopPropagation();
  }

  _onColumnFilterFocus(event, par) {
  	//alert('focus')
  	this._userFocusElement = {
            part: par['.part'],
            idx: par['.idx']
          };
  	event.preventDefault();
  	event.stopPropagation();
  }

  _onColumnFilterBlur(event, par) {
  	//alert('blur')
  	this._userFocusElement = null;
  	event.preventDefault();
  	event.stopPropagation();
  }

  _onRowClick(event, par) {
  	this._rowClicked(par["item"], par["itemIndex"] + this._firstItemIndex, event);
  	event.preventDefault();
  	event.stopPropagation();
  }

  _onDetailsRowClick(event, par) {
  	this._rowClicked(par["item"], par["itemIndex"] + this._firstItemIndex, event, true);
  	event.preventDefault();
  	event.stopPropagation();
  }

  _onSortFooterClick(event, par) {
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

  static datatableInterface(element, config, par) {
    let data = Data.getData(element, DATA_KEY)
    if (!data) {
      data = typeof config === 'object' ? new Datatable(element, config) : new Datatable(element)
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
        data[config]()
        break;
      }
    }
  }

  static jQueryInterface(config, par) {
    return this.each(function () {
      Datatable.datatableInterface(this, config, par);
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
