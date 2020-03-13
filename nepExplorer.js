(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('d3'), require('webcharts')) :
    typeof define === 'function' && define.amd ? define(['d3', 'webcharts'], factory) :
    (global = global || self, global.nepExplorer = factory(global.d3, global.webCharts));
}(this, (function (d3$1, webcharts) { 'use strict';

    if (typeof Object.assign != 'function') {
      Object.defineProperty(Object, 'assign', {
        value: function assign(target, varArgs) {

          if (target == null) {
            // TypeError if undefined or null
            throw new TypeError('Cannot convert undefined or null to object');
          }

          var to = Object(target);

          for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];

            if (nextSource != null) {
              // Skip over if undefined or null
              for (var nextKey in nextSource) {
                // Avoid bugs when hasOwnProperty is shadowed
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                  to[nextKey] = nextSource[nextKey];
                }
              }
            }
          }

          return to;
        },
        writable: true,
        configurable: true
      });
    }

    if (!Array.prototype.find) {
      Object.defineProperty(Array.prototype, 'find', {
        value: function value(predicate) {
          // 1. Let O be ? ToObject(this value).
          if (this == null) {
            throw new TypeError('"this" is null or not defined');
          }

          var o = Object(this); // 2. Let len be ? ToLength(? Get(O, 'length')).

          var len = o.length >>> 0; // 3. If IsCallable(predicate) is false, throw a TypeError exception.

          if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
          } // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.


          var thisArg = arguments[1]; // 5. Let k be 0.

          var k = 0; // 6. Repeat, while k < len

          while (k < len) {
            // a. Let Pk be ! ToString(k).
            // b. Let kValue be ? Get(O, Pk).
            // c. Let testResult be ToBoolean(? Call(predicate, T, � kValue, k, O �)).
            // d. If testResult is true, return kValue.
            var kValue = o[k];

            if (predicate.call(thisArg, kValue, k, o)) {
              return kValue;
            } // e. Increase k by 1.


            k++;
          } // 7. Return undefined.


          return undefined;
        }
      });
    }

    if (!Array.prototype.findIndex) {
      Object.defineProperty(Array.prototype, 'findIndex', {
        value: function value(predicate) {
          // 1. Let O be ? ToObject(this value).
          if (this == null) {
            throw new TypeError('"this" is null or not defined');
          }

          var o = Object(this); // 2. Let len be ? ToLength(? Get(O, "length")).

          var len = o.length >>> 0; // 3. If IsCallable(predicate) is false, throw a TypeError exception.

          if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
          } // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.


          var thisArg = arguments[1]; // 5. Let k be 0.

          var k = 0; // 6. Repeat, while k < len

          while (k < len) {
            // a. Let Pk be ! ToString(k).
            // b. Let kValue be ? Get(O, Pk).
            // c. Let testResult be ToBoolean(? Call(predicate, T, � kValue, k, O �)).
            // d. If testResult is true, return k.
            var kValue = o[k];

            if (predicate.call(thisArg, kValue, k, o)) {
              return k;
            } // e. Increase k by 1.


            k++;
          } // 7. Return -1.


          return -1;
        }
      });
    }

    Math.log10 = Math.log10 = Math.log10 || function (x) {
      return Math.log(x) * Math.LOG10E;
    };

    d3$1.selection.prototype.moveToFront = function () {
      return this.each(function () {
        this.parentNode.appendChild(this);
      });
    };

    d3$1.selection.prototype.moveToBack = function () {
      return this.each(function () {
        var firstChild = this.parentNode.firstChild;

        if (firstChild) {
          this.parentNode.insertBefore(this, firstChild);
        }
      });
    };

    function layout(element) {
      var containers = {
        main: d3$1.select(element).append('div').classed('wc-framework', true)
      };
      containers.controls = containers.main.append('div').classed('wc-component wc-component--controls', true);
      containers.kdigoScatterPlot = containers.main.append('div').classed('wc-component wc-component--chart wc-component--kdigo-scatter-plot', true);
      containers.timeSeries = containers.main.append('div').classed('wc-component wc-component--time-series', true);
      containers.timeSeriesNote = containers.timeSeries.append('div').classed('wc-note wc-component--time-series__note', true).text('Click a point to view associated charts.');
      return containers;
    }

    function styles() {
      var styles = ['.wc-framework {', '    width: 100%;', '    display: inline-block;', '}', '.wc-hidden {', '    display: none !important;', '}', '.wc-invisible {', '    visibility: hidden;', '}', '.wc-header {', '    font-size: 20px;', '    font-weight: bold;', '}', '.wc-row {', '    width: 100%;', '    display: inline-block;', '}', '.wc-component--chart {', '    display: inline-block;', '}', '.wc-component--kdigo-scatter-plot {', '    width: 48%;', '    float: left;', '}', '.wc-component--time-series {', '    width: 48%;', '    float: right;', '}', '.wc-component--time-series-chart {', '    width: 100%;', '}', '.kdigo-stage {', '    stroke: black;', '}', '.wc-component--kdigo-scatter-plot circle.wc-data-mark {', '    cursor: pointer;', '    stroke: black;', '    fill-opacity: 1;', '    stroke-width: 1;', '}', '.wc-component--kdigo-scatter-plot circle.wc-data-mark:hover {', '    stroke-width: 3;', '}' //'.wc-framework .wc-component--chart:nth-child(3n-2) {',
      //'    float: left;',
      //'}',
      //'.wc-framework .wc-component--chart:nth-child(3n-1) {',
      //'    margin: 0 2%;',
      //'}',
      //'.wc-framework .wc-component--chart:nth-child(3n) {',
      //'    float: right;',
      //'}',
      ];
      var style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = styles.join('\n');
      document.getElementsByTagName('head')[0].appendChild(style);
      return style;
    }

    function addVariables(_ref) {
      var settings = _ref.settings.synced,
          data = _ref.data.data;
      data.forEach(function (d) {
        d.id = d[settings.id_col];
        d.visit = d[settings.visit_col];
        d.visitn = parseFloat(d[settings.visitn_col]);
        d.studyday = parseFloat(d[settings.studyday_col]);
        d.measure = d[settings.measure_col];
        d.result = parseFloat(d[settings.value_col]);
        d.unit = d[settings.unit_col];
        d.lln = parseFloat(d[settings.normal_col_low]);
        d.uln = parseFloat(d[settings.normal_col_high]);
        d.baseline = d[settings.baseline_col];
      });
      return data;
    }

    function defineParticipantLevelData(_ref) {
      var settings = _ref.settings.synced,
          data = _ref.data.data;
      var participantLevel = d3.nest().key(function (d) {
        return d.id;
      }).key(function (d) {
        return d.measure;
      }).rollup(function (data) {
        var baseline = data.find(function (d) {
          return Array.isArray(settings.baseline_value) ? settings.baseline_value.includes(d.baseline) : settings.baseline_value === d.baseline;
        });
        data.forEach(function (d) {
          d.chg = baseline ? d.result - baseline.result : null;
          d.fchg = baseline && baseline.result > 0 ? d.result / baseline.result : null;
          d.pchg = baseline && baseline.result > 0 ? (d.result / baseline.result - 1) * 100 : null;
          d.xuln = d.result > 0 && d.uln > 0 ? d.result / d.uln : null;
        });
        var datum = {
          data: data
        };
        datum.min = d3.min(datum.data, function (d) {
          return d.result;
        });
        datum.max = d3.max(datum.data, function (d) {
          return d.result;
        });
        datum.min_chg = d3.min(datum.data, function (d) {
          return d.chg;
        });
        datum.max_chg = d3.max(datum.data, function (d) {
          return d.chg;
        });
        datum.min_fchg = d3.min(datum.data, function (d) {
          return d.fchg;
        });
        datum.max_fchg = d3.max(datum.data, function (d) {
          return d.fchg;
        });
        datum.min_pchg = d3.min(datum.data, function (d) {
          return d.pchg;
        });
        datum.max_pchg = d3.max(datum.data, function (d) {
          return d.pchg;
        });
        return datum;
      }).entries(data);
      participantLevel.forEach(function (d) {
        var egfr_creat = d.values.find(function (di) {
          return di.key === settings.measure_values.egfr_creat;
        });
        var creat = d.values.find(function (di) {
          return di.key === settings.measure_values.creat;
        });
        d.egfr_creat_chg = egfr_creat ? (egfr_creat.values.max_fchg - 1) * 100 : null;
        d.creat_fchg = creat ? creat.values.max_fchg : null;
        d.creat_fn = d.creat_chg >= 0.3 ? 1 : 0;
        var egfr_cystatc = d.values.find(function (di) {
          return di.key === settings.measure_values.egfr_cystatc;
        });
        var cystatc = d.values.find(function (di) {
          return di.key === settings.measure_values.cystatc;
        });
        d.egfr_cystatc_chg = egfr_cystatc ? egfr_cystatc.values.max_chg : null;
        d.cystatc_fchg = cystatc ? cystatc.values.max_fchg : null;
        d.cystatc_fn = d.cystatc_chg >= 0.3 ? 1 : 0;
      });
      return participantLevel;
    }

    function drawTimeSeries(id) {
      var _this = this;

      var participant = this.data.participants.find(function (d) {
        return d.key === id;
      });

      var _loop = function _loop(name) {
        var chart = _this.charts[name];
        var chartMeasures = chart.config.measures.map(function (measure) {
          return _this.settings.synced.measure_values[measure];
        });
        var chartData = d3.merge(participant.values.filter(function (d) {
          return chartMeasures.includes(d.key);
        }).map(function (d) {
          return d.values.data;
        }));

        if (chartData.length) {
          if (chart.initialized) chart.draw(chartData);else chart.init(chartData);
        } else {
          delete _this.charts[chart];
          console.warn("[ ".concat(measures.join(', '), " ] do not exist in the data. The associated chart will not be displayed."));
        }
      };

      for (var name in this.charts) {
        _loop(name);
      }

      this.containers.timeSeriesNote.text("Viewing charts for participant ".concat(id, "."));
    }

    function init(data) {
      this.data = {
        data: data
      };
      addVariables(this);
      this.data.participants = defineParticipantLevelData(this);
      this.kdigoScatterPlot.nepExplorer = this;
      this.kdigoScatterPlot.init(this.data.participants);
    }

    function destroy() {}

    function renderer() {
      return {
        // data mappings
        id_col: 'USUBJID',
        visit_col: 'VISIT',
        visitn_col: 'VISITNUM',
        studyday_col: 'DY',
        measure_col: 'TEST',
        value_col: 'STRESN',
        unit_col: 'STRESU',
        normal_col_low: 'STNRLO',
        normal_col_high: 'STNRHI',
        baseline_col: 'ABLFL',
        // value mappings
        measure_values: {
          // creatinine-based measures
          creat: 'Creatinine',
          egfr_creat: 'eGFR',
          // cystatin C-based measures
          cystatc: 'Cystatin C',
          egfr_cystatc: 'eGFRcys',
          // kidney function-related measures
          bun: 'Blood Urea Nitrogen',
          sodium: 'Sodium',
          k: 'Potassium',
          bicarb: 'Bicarbonate',
          cl: 'Chloride',
          phos: 'Phosphorus',
          ca: 'Calcium',
          // blood pressure
          diabp: 'Diastolic Blood Pressure',
          sysbp: 'Systolic Blood Pressure',
          // albumin/creatinine
          alb: 'Albumin',
          albcreat: 'Albumin/Creatinine'
        },
        // renderer settings
        filters: [],
        baseline_value: 'Y',
        kdigo_criteria: {
          stage_1: {
            creat_fchg: 1.5,
            egfr_creat_fchg: 25,
            color: 'yellow'
          },
          stage_2: {
            creat_fchg: 2,
            egfr_creat_fchg: 50,
            color: 'orange'
          },
          stage_3: {
            creat_fchg: 3,
            egfr_creat_fchg: 75,
            color: 'red'
          }
        },
        kdigo_dc_criteria: {
          stage_1: {
            creat: 0.3,
            egfr: 25
          },
          stage_2: {
            creat: 0.7,
            egfr: 50
          },
          stage_3: {
            creat: 1.2,
            egfr: 75
          }
        }
      };
    }

    function kdigoScatterPlot() {
      return {
        x: {
          column: 'creat_fchg',
          type: 'linear',
          label: 'Creatinine Fold Change from Baseline',
          format: '.1f',
          domain: [1, null]
        },
        y: {
          column: 'egfr_creat_chg',
          type: 'linear',
          label: 'eGFR Percent Change from Baseline',
          format: ',1d',
          domain: [0, null]
        },
        marks: [{
          type: 'circle',
          per: ['key'],
          tooltip: '[key]: $x,$y'
        }],
        resizable: false,
        aspect: 2
      };
    }

    function syncSettings(settings) {
      return settings;
    }

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);

      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
        keys.push.apply(keys, symbols);
      }

      return keys;
    }

    function _objectSpread2(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};

        if (i % 2) {
          ownKeys(Object(source), true).forEach(function (key) {
            _defineProperty(target, key, source[key]);
          });
        } else if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
          ownKeys(Object(source)).forEach(function (key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
        }
      }

      return target;
    }

    function albcreat() {
      return {
        measures: ['creat', 'cystatc'],
        y: {
          column: 'pchg',
          label: 'Change from Baseline (%)'
        }
      };
    }

    function albcreat$1() {
      return {
        measures: ['egfr_creat', 'egfr_cystatc'],
        y: {
          column: 'chg',
          label: 'Change from Baseline'
        }
      };
    }

    function albcreat$2() {
      return {
        measures: ['bun', 'sodium', 'k', 'bicarb', 'cl', 'phos', 'ca'],
        y: {
          column: 'xuln',
          label: 'Standardized Result (xULN)'
        }
      };
    }

    function albcreat$3() {
      return {
        measures: ['sysbp', 'diabp'],
        y: {
          column: 'result',
          label: 'Blood Pressure (mmHg)'
        }
      };
    }

    function albcreat$4() {
      return {
        measures: ['albcreat'],
        y: {
          column: 'result',
          label: 'Albumin/Creatinine Ratio (mg/g)'
        }
      };
    }

    var customSettings = {
      creat_cystatc: albcreat,
      egfr: albcreat$1,
      uln: albcreat$2,
      bp: albcreat$3,
      albcreat: albcreat$4
    };

    function timeSeries(chart) {
      var chartSettings = customSettings[chart]();
      var settings = {
        measures: chartSettings.measures,
        x: {
          column: 'studyday',
          type: 'linear',
          label: 'Study Day',
          format: ',1d'
        },
        y: _objectSpread2({}, chartSettings.y, {
          type: 'linear',
          format: '.1f'
        }),
        marks: [{
          type: 'line',
          per: ['measure'],
          tooltip: '$x,$y'
        }, {
          type: 'circle',
          per: ['measure', 'studyday'],
          tooltip: '$x,$y'
        }],
        color_by: 'measure',
        legend: {
          label: 'Measure',
          location: 'top'
        },
        gridlines: 'xy',
        resizable: false,
        aspect: 4
      };
      return settings;
    }

    function syncSettings$1(settings) {
      return settings;
    }

    function controlInputs() {
      return [];
    }

    function syncControlInputs(controlInputs, settings) {
      //Add filters to default controls.
      if (Array.isArray(settings.filters) && settings.filters.length > 0) {
        settings.filters.forEach(function (filter) {
          var filterObj = {
            type: 'subsetter',
            value_col: filter.value_col || filter,
            label: filter.label || filter.value_col || filter
          };
          controlInputs.push(filterObj);
        });
      }

      return controlInputs;
    }

    var configuration = {
      renderer: renderer,
      kdigoScatterPlot: kdigoScatterPlot,
      syncKdigoScatterPlot: syncSettings,
      timeSeries: timeSeries,
      syncTimeSeries: syncSettings$1,
      controlInputs: controlInputs,
      syncControlInputs: syncControlInputs
    };

    function onInit() {}

    function onLayout() {}

    function onPreprocess() {}

    function onDatatransform() {}

    function onDraw() {
      this.x_dom[1] = Math.max(this.x_dom[1], 3);
      this.y_dom[1] = Math.max(this.y_dom[1], 75);
    }

    function drawKdigoStages() {
      var _this = this;

      this.svg.selectAll('.kdigo-stages').remove(); //this.svg.append('rect')
      //    .attr('x', 0)
      //    .attr('y', this.plot_height - this.plot_height)
      //    .attr('width', this.plot_width)
      //    .attr('height', this.plot_height)
      //    .attr('fill', 'red');
      //this.svg.append('rect')
      //    .attr('x', 0)
      //    .attr('y', this.plot_height - this.plot_height/2)
      //    .attr('width', this.plot_width/2)
      //    .attr('height', this.plot_height/2)
      //    .attr('fill', 'orange');
      //this.svg.append('rect')
      //    .attr('x', 0)
      //    .attr('y', this.plot_height - this.plot_height/3)
      //    .attr('width', this.plot_width/3)
      //    .attr('height', this.plot_height/3)
      //    .attr('fill', 'yellow');
      //this.svg.append('rect')
      //    .attr('x', 0)
      //    .attr('y', this.plot_height - this.plot_height/4)
      //    .attr('width', this.plot_width/4)
      //    .attr('height', this.plot_height/4)
      //    .attr('fill', 'white');
      //const kdigo_criteria = Object.keys(this.config.kdigo_criteria)
      //    .map(key => this.config.kdigo_criteria[key]);
      //kdigo_criteria.unshift({
      //    creat_fchg: 1,
      //    egfr_creat_fchg: 0,
      //    color: 'white',
      //});
      //kdigo_criteria.push({
      //    creat_fchg: this.x_dom[1],
      //    egfr_creat_fchg: this.y_dom[1],
      //    color: this.config.kdigo_criteria.stage_3.color,
      //});
      //console.table(kdigo_criteria);
      //const d = kdigo_criteria[2];
      //console.log(this.y(d.egfr_creat_fchg));
      //this.svg.append('rect')
      //    .attr('x', 0)
      //    .attr('y', this.y(d.egfr_creat_fchg))
      //    .attr('width', this.x(d.creat_fchg))
      //    .attr('height', this.plot_height - this.y(d.egfr_creat_fchg))
      //    .attr('fill', d.color);
      //const kdigo_pairs = d3.pairs(kdigo_criteria.reverse());
      //kdigo_pairs.forEach(d => {
      //    d.x = 0; // x starts at the left side of the chart
      //    d.y = this.plot_height - this.y(d[1].egfr_creat_fchg);
      //    d.width = this.x(d[0].creat_fchg) - d.x;
      //    d.height = this.y(d[1].egfr_creat_fchg);
      //    d.fill = d[1].color;
      //    console.log(d);
      //});
      //const kdigoStages = this.svg
      //    .insert('g', '.overlay')
      //    .classed('kdigo-stages', true);
      //kdigoStages
      //    .selectAll('rect.kdigo-stage')
      //    .data(kdigo_criteria.reverse())
      //    .enter()
      //    .append('rect')
      //    .classed('kdigo-stage', true)
      //    .attr({
      //        x: d => 0,
      //        y: d => this.y(d.egfr_creat_fchg),
      //        width: d => this.x(d.creat_fchg),
      //        height: d => this.plot_height - this.y(d.egfr_creat_fchg),
      //        fill: d => d.color,
      //    });

      this.svg.select('.kdigo-stages').remove();
      var g = this.svg.insert('g', '.overlay').classed('kdigo-stages', true);
      var rects = g.selectAll('rect').data([{
        label: 'KDIGO Stage 3',
        dimensions: [[1, this.x_dom[1]], [0, this.y_dom[1]]],
        color: 'red'
      }, {
        label: 'KDIGO Stage 2',
        dimensions: [[1, 3], [0, 75]],
        color: 'orange'
      }, {
        label: 'KDIGO Stage 1',
        dimensions: [[1, 2], [0, 50]],
        color: 'yellow'
      }, {
        label: '',
        dimensions: [[1, 1.5], [0, 25]],
        color: 'white'
      }]).enter().append('rect').classed('kdigo-stage', true).attr({
        x: function x(d) {
          return _this.x(d.dimensions[0][0]);
        },
        y: function y(d) {
          return _this.y(d.dimensions[1][1]);
        },
        width: function width(d) {
          return _this.x(d.dimensions[0][1]) - _this.x(d.dimensions[0][0]);
        },
        height: function height(d) {
          return _this.y(d.dimensions[1][0]) - _this.y(d.dimensions[1][1]);
        },
        fill: function fill(d) {
          return d.color;
        },
        'clip-path': "url(#".concat(this.id, ")")
      });
      rects.append('title').text(function (d) {
        return d.label;
      });
    }

    function addPointClick() {
      var chart = this;
      var points = this.marks.find(function (mark) {
        return mark.type === 'circle';
      }).circles;
      points.on('mouseover', function (d) {
        d3$1.select(this).classed('highlighted', true);
      }).on('mouseout', function (d) {
        d3$1.select(this).classed('highlighted', false);
      }).on('click', function (d) {
        points.classed('selected', false);
        d3$1.select(this).classed('selected', true);
        drawTimeSeries.call(chart.nepExplorer, d.key);
      });
    }

    function onResize() {
      drawKdigoStages.call(this);
      addPointClick.call(this);
    }

    function onDestroy() {}

    var kdigoScatterPlotCallbacks = {
      onInit: onInit,
      onLayout: onLayout,
      onPreprocess: onPreprocess,
      onDatatransform: onDatatransform,
      onDraw: onDraw,
      onResize: onResize,
      onDestroy: onDestroy
    };

    function onInit$1() {
      this.initialized = true;
    }

    function onLayout$1() {}

    function onPreprocess$1() {}

    function onDatatransform$1() {}

    function onDraw$1() {}

    function onResize$1() {}

    function onDestroy$1() {}

    var timeSeriesCallbacks = {
      onInit: onInit$1,
      onLayout: onLayout$1,
      onPreprocess: onPreprocess$1,
      onDatatransform: onDatatransform$1,
      onDraw: onDraw$1,
      onResize: onResize$1,
      onDestroy: onDestroy$1
    };

    function nepExplorer() {
      var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'body';
      var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var nepExplorer = {
        element: element,
        containers: layout(element),
        styles: styles(),
        settings: {
          user: settings
        },
        charts: {},
        init: init,
        destroy: destroy
      }; // KDIGO scatter plot

      nepExplorer.settings.merged = Object.assign({}, configuration.renderer(), configuration.kdigoScatterPlot(), nepExplorer.settings.user);
      nepExplorer.settings.synced = configuration.syncKdigoScatterPlot(nepExplorer.settings.merged);
      nepExplorer.kdigoScatterPlot = webcharts.createChart(nepExplorer.containers.kdigoScatterPlot.node(), nepExplorer.settings.synced);

      for (var callback in kdigoScatterPlotCallbacks) {
        nepExplorer.kdigoScatterPlot.on(callback.substring(2).toLowerCase(), kdigoScatterPlotCallbacks[callback]);
      } // time series


      ['creat_cystatc', 'egfr', 'uln', 'bp', 'albcreat'].forEach(function (chart) {
        nepExplorer.containers[chart] = nepExplorer.containers.timeSeries.append('div').classed("wc-component wc-component--chart wc-component--time-series-chart wc-component--".concat(chart), true);
        var mergedSettings = Object.assign({}, configuration.renderer(), configuration.timeSeries(chart), nepExplorer.settings.user);
        var syncedSettings = configuration.syncTimeSeries(mergedSettings);
        var timeSeries = webcharts.createChart(nepExplorer.containers[chart].node(), syncedSettings);

        for (var _callback in timeSeriesCallbacks) {
          timeSeries.on(_callback.substring(2).toLowerCase(), timeSeriesCallbacks[_callback]);
        }

        nepExplorer.charts[chart] = timeSeries;
      });
      return nepExplorer;
    }

    return nepExplorer;

})));
