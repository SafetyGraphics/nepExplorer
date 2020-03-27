(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? (module.exports = factory(require('d3'), require('webcharts')))
        : typeof define === 'function' && define.amd
        ? define(['d3', 'webcharts'], factory)
        : ((global = global || self), (global.nepExplorer = factory(global.d3, global.webCharts)));
})(this, function(d3$1, webcharts) {
    'use strict';

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

    Math.log10 = Math.log10 =
        Math.log10 ||
        function(x) {
            return Math.log(x) * Math.LOG10E;
        };

    d3$1.selection.prototype.moveToFront = function() {
        return this.each(function() {
            this.parentNode.appendChild(this);
        });
    };

    d3$1.selection.prototype.moveToBack = function() {
        return this.each(function() {
            var firstChild = this.parentNode.firstChild;

            if (firstChild) {
                this.parentNode.insertBefore(this, firstChild);
            }
        });
    };

    function layout(element) {
        var containers = {
            main: d3$1
                .select(element)
                .append('div')
                .classed('wc-framework', true)
        }; // column: left

        containers.leftColumn = containers.main
            .append('div')
            .classed('wc-column wc-column--left', true); // section: controls

        containers.controls = containers.leftColumn
            .append('div')
            .classed('wc-section wc-section--controls', true); // column: right

        containers.rightColumn = containers.main
            .append('div')
            .classed('wc-column wc-column--right', true); // section: population

        containers.population = containers.rightColumn
            .append('div')
            .classed('wc-section wc-section--population', true); // component: kdigo scatter plot

        containers.kdigo = containers.population
            .append('div')
            .classed('wc-component wc-component--kdigo', true); // header

        containers.kdigoHeader = containers.kdigo
            .append('div')
            .classed('wc-header wc-header--kdigo-scatter-plot', true)
            .text('KDIGO Scatter Plot'); // content

        containers.kdigoScatterPlot = containers.kdigo
            .append('div')
            .classed('wc-subcomponent wc-subcomponent--kdigo-scatter-plot', true);
        containers.kdigoLegend = containers.kdigoScatterPlot
            .append('div')
            .classed('wc-subcomponent__legend', true); // section: participant

        containers.participant = containers.rightColumn
            .append('div')
            .classed('wc-section wc-section--participant', true); // component: details

        containers.detailsContainer = containers.participant
            .append('div')
            .classed('wc-component wc-component--details-container', true); // header

        containers.detailsHeader = containers.detailsContainer
            .append('div')
            .classed('wc-header wc-header--details', true);
        containers.detailsHeaderText = containers.detailsHeader
            .append('span')
            .classed('wc-header__text', true)
            .text('Click a point to view participant details.');
        containers.detailsClear = containers.detailsHeader
            .append('button')
            .classed('wc-header__button wc-component__details-clear wc-hidden', true)
            .text('Clear'); // content

        containers.detailsParticipant = containers.detailsContainer
            .append('ul')
            .classed('wc-subcomponent wc-subcomponent__details-participant wc-hidden', true); // component: time series

        containers.timeSeries = containers.participant
            .append('div')
            .classed('wc-component wc-component--time-series wc-hidden', true);
        return containers;
    }

    function styles() {
        var styles = [
            '.wc-framework {',
            '    width: 100%;',
            '    display: inline-block;',
            '}',
            '.wc-hidden {',
            '    display: none !important;',
            '}',
            '.wc-invisible {',
            '    visibility: hidden;',
            '}',
            '.wc-column {',
            '    display: inline-block;',
            '}',
            '.wc-section {',
            '    display: inline-block;',
            '    width: 100%;',
            '}',
            '.wc-component {',
            '    display: inline-block;',
            '    width: 100%;',
            '}',
            '.wc-header {',
            '    border-top: 2px solid black;',
            '    border-bottom: 2px solid black;',
            '    padding: 0.2em;',
            '    font-weight: bold;',
            '}',
            '.wc-subcomponent {',
            '    width: 50%;',
            '    min-width: 500px;',
            '}',
            '.wc-chart {',
            '    width: 80%;',
            '    min-width: 400px;',
            '    display: inline-block;',
            '}',
            /***--------------------------------------------------------------------------------------\
      column: left
      \--------------------------------------------------------------------------------------***/
            '.wc-column--left {',
            '    width: 20%;',
            '}',
            /****---------------------------------------------------------------------------------\
        section: controls
      \---------------------------------------------------------------------------------****/
            '.wc-section--controls {',
            '}',
            '.control-group {',
            '    width: 100%;',
            '}',
            '.changer {',
            '    width: 200px !important;',
            '}',
            '.wc-subheader {',
            '    border-top: 1px solid black;',
            '    border-bottom: 1px solid black;',
            '    margin-right: 1em;',
            '    margin-bottom: 1em;',
            '}',
            '.wc-subheader__text {',
            '    display: block;',
            '}',
            '.wc-subheader__content {',
            '    font-size: .8em;',
            '}',
            /***--------------------------------------------------------------------------------------\
      column: right
      \--------------------------------------------------------------------------------------***/
            '.wc-column--right {',
            '    width: 78%;',
            '    float: right;',
            '}',
            /****---------------------------------------------------------------------------------\
        section: population
      \---------------------------------------------------------------------------------****/
            '.wc-section--population {',
            '}',
            /*****----------------------------------------------------------------------------\
        component: kdigo scatter plot
      \----------------------------------------------------------------------------*****/
            '.wc-component--kdigo {',
            '}',
            '.wc-subcomponent--kdigo-scatter-plot {',
            '    position: relative;',
            '}',
            '.wc-subcomponent--kdigo-scatter-plot circle.wc-data-mark {',
            '    cursor: pointer;',
            '    stroke: black;',
            '    fill-opacity: 1;',
            '    stroke-width: 1;',
            '}',
            '.wc-subcomponent--kdigo-scatter-plot circle.wc-data-mark:hover {',
            '    stroke-width: 3;',
            '}',
            '.wc-subcomponent--kdigo-scatter-plot circle.wc-data-mark.wc-selected {',
            '    stroke-width: 3;',
            '}',
            '.kdigo-stage {',
            '    stroke: black;',
            '}',
            '.wc-subcomponent--kdigo-scatter-plot .tick line {',
            '    stroke-opacity: .4;',
            '}',
            '.wc-subcomponent--kdigo-scatter-plot .legend--kdigo {',
            '    height: 20px;',
            '    margin: 8px 0px;',
            '}',
            '.wc-subcomponent__legend {',
            '    position: absolute;', //'    top: 14;',
            //'    bottom: 0;',
            '    left: 80%;',
            '    width: 100%;',
            '}',
            '.wc-subcomponent__legend .wc-chart {',
            '    width: 100%;',
            '}',
            '.wc-subcomponent__legend .interactivity {',
            '    display: none;',
            '}',
            '.wc-subcomponent__legend table {',
            '    border-collapse: collapse;',
            '}',
            '.wc-subcomponent__legend thead {',
            '    border-top: 2px solid #999;',
            '    border-bottom: 2px solid #999;',
            '}',
            '.wc-subcomponent__legend thead tr {',
            '    padding: 0.1em;',
            '}',
            '.wc-subcomponent__legend tbody {',
            '    border-bottom: 2px solid #999;',
            '}',
            '.wc-subcomponent__legend tbody {',
            '    border-bottom: 2px solid #999;',
            '}',
            '.wc-subcomponent__legend tbody tr {',
            '    padding: 0.1em;',
            '}',
            '.wc-subcomponent__legend tbody td {',
            '    text-align: center;',
            '    font-size: 0.9em;',
            '    padding: 0 0.5em 0 0.5em;',
            '}',
            /****---------------------------------------------------------------------------------\
        section: participant
      \---------------------------------------------------------------------------------****/
            '.wc-section--participant {',
            '}',
            /*****----------------------------------------------------------------------------\
        component: details
      \----------------------------------------------------------------------------*****/
            '.wc-component__details-clear {',
            '    margin: 0.5em;',
            '}',
            '.wc-subcomponent__details-participant {',
            '    list-style: none;',
            '    padding: 0;',
            '    width: 100%;',
            '}',
            '.wc-details__li {',
            '    display: inline-block;',
            '    text-align: center;',
            '    padding: 0.5em;',
            '}',
            '.wc-details__label {',
            '    font-size: 0.8em;',
            '}',
            '.wc-details__value {',
            '}',
            /*****----------------------------------------------------------------------------\
        component: time series
      \----------------------------------------------------------------------------*****/
            '.wc-diff .wc-hover-line {',
            '    stroke: #fff;',
            '    stroke-width: 16;',
            '    stroke-opacity: 0;',
            '}',
            '.wc-diff .wc-visible-line {',
            '    stroke-width: 2;',
            '    stroke: #8E4C6A;',
            '    stroke-dasharray: 3 3;',
            '}',
            '.wc-diff .wc-visible-line.wc-hovered {',
            '    stroke-dasharray: 0;',
            '}',
            '.wc-component--time-series .axis-title {',
            '    font-size: 14px;',
            '    font-weight: bold;',
            '}',
            '.wc-chart-container {',
            '    position: relative;',
            '}',
            '.legend--time-series {',
            '    position: absolute;',
            '    left: 80%;',
            '    width: 100%;',
            '}',
            '.legend--time-series .legend-item {',
            '    float: left;',
            '    clear: left;',
            '    margin-right: 0 !important;',
            '    height: 14px;',
            '}',
            '.legend--time-series .legend-mark-text {',
            '    display: none;',
            '}',
            '.legend--time-series .legend-label {',
            '    font-size: 12px;',
            '}',
            '.legend--time-series .legend-color-block {',
            '}',
            '.legend--time-series .legend-mark {',
            '    transform: translate(0,2px);',
            '    stroke-width: 4;',
            '}',
            '.wc-reference-lines {',
            '    cursor: help;',
            '}',
            '.wc-reference-line {',
            '    x1: 0;',
            '    stroke: #999;',
            '    stroke-dasharray: 3 3;',
            '}',
            '.wc-reference-label {',
            '    text-anchor: end;',
            '    alignment-baseline: baseline;',
            '    fill: #999;',
            '}'
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
        data.forEach(function(d) {
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
        var participantLevel = d3
            .nest()
            .key(function(d) {
                return d.id;
            })
            .key(function(d) {
                return d.measure;
            })
            .rollup(function(data) {
                var baseline = data.find(function(d) {
                    return Array.isArray(settings.baseline_value)
                        ? settings.baseline_value.includes(d.baseline)
                        : settings.baseline_value === d.baseline;
                });
                data.forEach(function(d) {
                    d.chg = baseline ? d.result - baseline.result : null;
                    d.fchg =
                        baseline && baseline.result > 0
                            ? Math.round((d.result / baseline.result) * 100) / 100
                            : null;
                    d.pchg =
                        baseline && baseline.result > 0
                            ? Math.round((d.result / baseline.result - 1) * 100 * 100) / 100
                            : null;
                    d.xuln =
                        d.result > 0 && d.uln > 0
                            ? Math.round((d.result / d.uln) * 100) / 100
                            : null;
                });
                var datum = {
                    data: data
                };
                datum.min = d3.min(datum.data, function(d) {
                    return d.result;
                });
                datum.max = d3.max(datum.data, function(d) {
                    return d.result;
                });
                datum.min_chg = d3.min(datum.data, function(d) {
                    return d.chg;
                });
                datum.max_chg = d3.max(datum.data, function(d) {
                    return d.chg;
                });
                datum.min_fchg = d3.min(datum.data, function(d) {
                    return d.fchg;
                });
                datum.max_fchg = d3.max(datum.data, function(d) {
                    return d.fchg;
                });
                datum.min_pchg = d3.min(datum.data, function(d) {
                    return d.pchg;
                });
                datum.max_pchg = d3.max(datum.data, function(d) {
                    return d.pchg;
                });
                return datum;
            })
            .entries(data); // Capture measure-level results at participant level.

        var measures = ['creat', 'cystatc', 'egfr_creat', 'egfr_cystatc'];
        var results = ['chg', 'fchg', 'pchg'];
        participantLevel.forEach(function(d) {
            var datum = data.find(function(di) {
                return di[settings.id_col] === d.key;
            }); // participant details

            settings.filters.forEach(function(filter) {
                d[filter.value_col] = datum[filter.value_col];
            });
            settings.details.forEach(function(detail) {
                d[detail.value_col] = datum[detail.value_col];
            }); // x- and y-axis

            measures.forEach(function(measure) {
                results.forEach(function(result) {
                    var measure_result = ''.concat(measure, '_').concat(result);
                    var measure_datum = d.values.find(function(di) {
                        return di.key === settings.measure_values[measure];
                    });
                    d[measure_result] = measure_datum
                        ? measure_datum.values['max_'.concat(result)]
                        : null;
                });
            }); // color

            d.creat_fn = d.creat_chg >= 0.3 ? 1 : 0;
            d.cystatc_fn = d.cystatc_chg >= 0.3 ? 1 : 0;
        });
        return participantLevel;
    }

    function init(data, participant) {
        // data manipulation
        this.data = {
            data: data
        };
        addVariables(this);
        this.data.participants = defineParticipantLevelData(this); // Attach participant value.

        this.participant = participant !== undefined ? participant : null; // Initialize KDIGO scatter plot.

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
            filters: [
                {
                    value_col: 'ARM',
                    label: 'Treatment Group'
                },
                {
                    value_col: 'AGEGRP',
                    label: 'Age Group'
                },
                {
                    value_col: 'SEX',
                    label: 'Sex'
                },
                {
                    value_col: 'RACE',
                    label: 'Race'
                }
            ],
            groups: [
                {
                    value_col: 'ARM',
                    label: 'Treatment Group'
                },
                {
                    value_col: 'AGEGRP',
                    label: 'Age Group'
                },
                {
                    value_col: 'SEX',
                    label: 'Sex'
                },
                {
                    value_col: 'RACE',
                    label: 'Race'
                }
            ],
            details: [
                {
                    value_col: 'AGE',
                    label: 'Age'
                }
            ],
            baseline_value: 'Y',
            kdigo_criteria: [
                {
                    label: 'No AKI',
                    x: 0,
                    y: 0,
                    color: 'white'
                },
                {
                    label: 'Stage 1 AKI',
                    x: 1.5,
                    y: 25,
                    color: '#ffffbf'
                },
                {
                    label: 'Stage 2 AKI',
                    x: 2,
                    y: 50,
                    color: '#fdae61'
                },
                {
                    label: 'Stage 3 AKI',
                    x: 3,
                    y: 75,
                    color: '#d73027'
                }
            ],
            kdigo_dc_criteria: [
                {
                    label: 'No AKI',
                    x: 0,
                    y: 0,
                    color: 'white'
                },
                {
                    label: 'Stage 1 AKI',
                    x: 1.5,
                    y: 0.3,
                    color: '#ffffbf'
                },
                {
                    label: 'Stage 2 AKI',
                    x: 2,
                    y: 0.7,
                    color: '#fdae61'
                },
                {
                    label: 'Stage 3 AKI',
                    x: 3,
                    y: 1.2,
                    color: '#d73027'
                }
            ]
        };
    }

    function kdigoScatterPlot() {
        return {
            x: {
                column: 'creat_fchg',
                type: 'log',
                label: 'Creatinine Fold Change',
                format: '.1f',
                domain: [1, null]
            },
            y: {
                column: 'egfr_creat_pchg',
                type: 'log',
                label: 'eGFR Percent Change',
                format: ',1d',
                domain: [0, null]
            },
            marks: [
                {
                    type: 'circle',
                    per: ['key'],
                    tooltip: '[key]: $x,$y',
                    radius: 3,
                    attributes: {}
                }
            ],
            color_by: null,
            legend: {
                location: 'bottom',
                mark: 'circle'
            },
            //resizable: false,
            aspect: 1.25,
            gridlines: 'xy',
            margin: {
                top: 14,
                right: 0,
                left: 50,
                bottom: 0
            }
        };
    }

    function _typeof(obj) {
        '@babel/helpers - typeof';

        if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
            _typeof = function(obj) {
                return typeof obj;
            };
        } else {
            _typeof = function(obj) {
                return obj &&
                    typeof Symbol === 'function' &&
                    obj.constructor === Symbol &&
                    obj !== Symbol.prototype
                    ? 'symbol'
                    : typeof obj;
            };
        }

        return _typeof(obj);
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
            if (enumerableOnly)
                symbols = symbols.filter(function(sym) {
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
                ownKeys(Object(source), true).forEach(function(key) {
                    _defineProperty(target, key, source[key]);
                });
            } else if (Object.getOwnPropertyDescriptors) {
                Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
            } else {
                ownKeys(Object(source)).forEach(function(key) {
                    Object.defineProperty(
                        target,
                        key,
                        Object.getOwnPropertyDescriptor(source, key)
                    );
                });
            }
        }

        return target;
    }

    function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
    }

    function _toConsumableArray(arr) {
        return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
    }

    function _arrayWithoutHoles(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

            return arr2;
        }
    }

    function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
    }

    function _iterableToArray(iter) {
        if (
            Symbol.iterator in Object(iter) ||
            Object.prototype.toString.call(iter) === '[object Arguments]'
        )
            return Array.from(iter);
    }

    function _iterableToArrayLimit(arr, i) {
        if (
            !(
                Symbol.iterator in Object(arr) ||
                Object.prototype.toString.call(arr) === '[object Arguments]'
            )
        ) {
            return;
        }

        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;

        try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);

                if (i && _arr.length === i) break;
            }
        } catch (err) {
            _d = true;
            _e = err;
        } finally {
            try {
                if (!_n && _i['return'] != null) _i['return']();
            } finally {
                if (_d) throw _e;
            }
        }

        return _arr;
    }

    function _nonIterableSpread() {
        throw new TypeError('Invalid attempt to spread non-iterable instance');
    }

    function _nonIterableRest() {
        throw new TypeError('Invalid attempt to destructure non-iterable instance');
    }

    function baseline(settings) {
        // Map settings.baseline (an object with properties [ value_col  ] and [ values ]) to settings.baseline_col and settings.baseline_value.
        if (settings.baseline) {
            if (
                settings.baseline.value_col &&
                settings.baseline.value_col !== settings.baseline_col
            )
                settings.baseline_col = settings.baseline.value_col;
            if (settings.baseline.values && settings.baseline.values !== settings.baseline_value)
                settings.baseline_value = settings.baseline.values;
        }

        return [settings.baseline_col, settings.baseline_value];
    }

    function details(settings) {
        // Define default details.
        var details = [
            {
                value_col: settings.id_col,
                label: 'Subject Identifier'
            },
            {
                value_col: 'kdigo',
                label: 'KDIGO'
            }
        ]; // Add filters to default details.

        if (settings.filters)
            settings.filters.forEach(function(filter) {
                var obj = {
                    value_col: filter.value_col ? filter.value_col : filter,
                    label: filter.label
                        ? filter.label
                        : filter.value_col
                        ? filter.value_col
                        : filter
                };
                if (
                    details.find(function(detail) {
                        return detail.value_col === filter.value_col;
                    }) === undefined
                )
                    details.push(obj);
            }); // Add groups to default details.

        if (settings.groups)
            settings.groups
                .filter(function(group) {
                    return group.value_col !== 'NONE';
                })
                .forEach(function(group) {
                    var obj = {
                        value_col: group.value_col ? group.value_col : filter,
                        label: group.label
                            ? group.label
                            : group.value_col
                            ? group.value_col
                            : filter
                    };
                    if (
                        details.find(function(detail) {
                            return detail.value_col === obj.value_col;
                        }) === undefined
                    )
                        details.push(obj);
                }); // Convert details to array to array if needed

        if (!(settings.details instanceof Array))
            settings.details = typeof settings.details === 'string' ? [settings.details] : []; // Use default details if detailsIf [settings.details] is not specified:

        if (settings.details) {
            //If [settings.details] is specified:
            //Allow user to specify an array of columns or an array of objects with a column property
            //and optionally a column label.
            settings.details.forEach(function(detail) {
                if (
                    details
                        .map(function(d) {
                            return d.value_col;
                        })
                        .indexOf(detail.value_col ? detail.value_col : detail) === -1
                )
                    details.push({
                        value_col: detail.value_col ? detail.value_col : detail,
                        label: detail.label
                            ? detail.label
                            : detail.value_col
                            ? detail.value_col
                            : detail
                    });
            });
        }

        return details;
    }

    function syncKdigoScatterPlot(settings) {
        var _syncBaseline = baseline(settings);

        var _syncBaseline2 = _slicedToArray(_syncBaseline, 2);

        settings.baseline_col = _syncBaseline2[0];
        settings.baseline_value = _syncBaseline2[1];
        settings.details = details(settings);
        return settings;
    }

    function merge(value, replacement) {
        if (value === undefined) return replacement;
        if (replacement === undefined) return value;

        if (_typeof(value) !== _typeof(replacement)) {
            console.warn(
                'Type difference in merge():\nValue: [ '
                    .concat(JSON.stringify(value), ' ]\nReplacement: [ ')
                    .concat(JSON.stringify(replacement), ' ]')
            );
            return value || replacement;
        }

        if (_typeof(replacement) !== 'object') return replacement;

        if (Array.isArray(value)) {
            var array = [];

            for (var i = 0; i < Math.max(value.length, replacement.length); i++) {
                array[i] = merge(value[i], replacement[i]);
            }

            return array;
        }

        var obj = {};

        for (
            var _i = 0,
                _arr = [].concat(
                    _toConsumableArray(Object.keys(value)),
                    _toConsumableArray(Object.keys(replacement))
                );
            _i < _arr.length;
            _i++
        ) {
            var property = _arr[_i];
            obj[property] = merge(value[property], replacement[property]);
        }

        return obj;
    }

    function creat_cystatc() {
        return {
            title: 'Percent Change from Baseline',
            measures: ['creat', 'cystatc'],
            reference_lines: [
                {
                    y: 0,
                    label: 'Baseline',
                    tooltip: function tooltip(chart) {
                        return chart.filtered_data
                            .filter(function(d) {
                                return Array.isArray(chart.config.baseline_value)
                                    ? chart.config.baseline_value.includes(d.baseline)
                                    : chart.config.baseline_value === d.baseline;
                            })
                            .map(function(d) {
                                return ''.concat(d.measure, ': ').concat(d.result);
                            })
                            .join('\n');
                    }
                }
            ],
            y: {
                column: 'pchg',
                label: '%'
            },
            diff: true
        };
    }

    function egfr() {
        return {
            title: 'Change from Baseline',
            measures: ['egfr_creat', 'egfr_cystatc'],
            reference_lines: [
                {
                    y: 0,
                    label: 'Baseline',
                    tooltip: function tooltip(chart) {
                        return chart.filtered_data
                            .filter(function(d) {
                                return Array.isArray(chart.config.baseline_value)
                                    ? chart.config.baseline_value.includes(d.baseline)
                                    : chart.config.baseline_value === d.baseline;
                            })
                            .map(function(d) {
                                return ''.concat(d.measure, ': ').concat(d.result);
                            })
                            .join('\n');
                    }
                }
            ],
            y: {
                column: 'chg',
                label: 'mL/min/1.73m²'
            },
            diff: true
        };
    }

    function uln() {
        return {
            title: 'Standardized Lab Values',
            measures: ['bun', 'sodium', 'k', 'bicarb', 'cl', 'phos', 'ca'],
            reference_lines: [
                {
                    y: 1,
                    label: 'ULN',
                    tooltip: function tooltip(chart) {
                        return d3
                            .nest()
                            .key(function(d) {
                                return d.measure;
                            })
                            .rollup(function(data) {
                                return d3.median(data, function(d) {
                                    return d.uln;
                                });
                            })
                            .entries(chart.filtered_data)
                            .map(function(d) {
                                return ''.concat(d.key, ': ').concat(d.values);
                            })
                            .join('\n');
                    }
                }
            ],
            y: {
                column: 'xuln',
                label: '[xULN]',
                domain: [0, 3]
            }
        };
    }

    function bp() {
        return {
            title: 'Blood Pressure',
            measures: ['sysbp', 'diabp'],
            reference_lines: [
                {
                    y: 80,
                    label: 'Ideal Diastolic BP',
                    tooltip: '80 mmHg'
                },
                {
                    y: 120,
                    label: 'Ideal Systolic BP',
                    tooltip: '120 mmHg'
                }
            ],
            y: {
                column: 'result',
                label: 'mmHg',
                domain: [80, 120]
            }
        };
    }

    function albcreat() {
        return {
            title: 'Albumin/Creatinine Ratio',
            measures: ['albcreat'],
            reference_lines: [
                {
                    y: 0,
                    label: 'A1 Albuminuria',
                    tooltip: '0-<30 mg/g'
                },
                {
                    y: 30,
                    label: 'A2 Albuminuria',
                    tooltip: '30-<300 mg/g'
                },
                {
                    y: 300,
                    label: 'A3 Albuminuria',
                    tooltip: '>=300 mg/g'
                }
            ],
            y: {
                column: 'result',
                label: 'mg/g',
                domain: [0, 30]
            }
        };
    }

    var timeSeriesCharts = {
        creat_cystatc: creat_cystatc,
        egfr: egfr,
        uln: uln,
        bp: bp,
        albcreat: albcreat
    };

    function timeSeries(chart) {
        var customSettings = timeSeriesCharts[chart]();
        var commonSettings = {
            x: {
                column: 'studyday',
                type: 'linear',
                label: 'Study Day',
                format: ',1d'
            },
            y: {
                type: 'linear',
                format: '.1f'
            },
            marks: [
                {
                    type: 'line',
                    per: ['measure'],
                    tooltip: '$x,$y'
                },
                {
                    type: 'circle',
                    per: ['measure', 'studyday'],
                    tooltip: '$x,$y'
                }
            ],
            color_by: 'measure',
            colors: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#a65628', '#f781bf'],
            legend: {
                label: '',
                location: 'right',
                mark: 'line'
            },
            gridlines: 'xy',
            //resizable: false,
            aspect: 4,
            margin: {
                top: 14,
                right: 0,
                left: 50,
                bottom: 0
            }
        };
        var settings = merge(commonSettings, customSettings);
        settings.chart = chart;
        return settings;
    }

    function syncSettings(settings) {
        return settings;
    }

    function controlInputs() {
        return [
            {
                type: 'dropdown',
                label: 'X-axis',
                description: 'From baseline',
                option: 'x.column',
                values: ['creat_fchg', 'cystatc_fchg'],
                require: true
            },
            {
                type: 'dropdown',
                label: 'Y-axis',
                description: 'From baseline',
                option: 'y.column',
                values: ['egfr_creat_pchg', 'egfr_cystatc_pchg', 'creat_chg', 'cystatc_chg'],
                require: true
            },
            {
                type: 'dropdown',
                label: 'Axis Type',
                description: 'log or linear',
                options: ['x.type', 'y.type'],
                values: ['log', 'linear'],
                require: true
            }
        ];
    }

    function syncControlInputs(controlInputs, settings) {
        // Add filters to default controls.
        if (Array.isArray(settings.filters) && settings.filters.length > 0) {
            settings.filters.forEach(function(filter, i) {
                var filterObj = {
                    type: 'subsetter',
                    label: filter.label || filter.value_col || filter,
                    description: null,
                    value_col: filter.value_col || filter,
                    multiple: true
                };
                controlInputs.splice(i, 0, filterObj);
            });
        } // Add group control.

        if (Array.isArray(settings.groups) && settings.groups.length > 0) {
            controlInputs.splice(controlInputs.length - 1, 0, {
                type: 'dropdown',
                label: 'Group',
                description: 'Grouping variable',
                options: ['color_by', 'legend.label'],
                values: settings.groups.map(function(group) {
                    return group.value_col || group;
                })
            });
        }

        return controlInputs;
    }

    var configuration = {
        renderer: renderer,
        kdigoScatterPlot: kdigoScatterPlot,
        syncKdigoScatterPlot: syncKdigoScatterPlot,
        timeSeries: timeSeries,
        timeSeriesCharts: timeSeriesCharts,
        syncTimeSeries: syncSettings,
        controlInputs: controlInputs,
        syncControlInputs: syncControlInputs
    };

    function onInit() {}

    function groupControls() {
        this.controls.controlGroups = this.controls.wrap
            .selectAll('.control-group')
            .attr('class', function(d) {
                return 'control-group control-group--'.concat(d.type);
            }); // group filters

        this.controls.filters = this.controls.controlGroups.filter(function(d) {
            return d.type === 'subsetter';
        });
        this.controls.filtersHeader = this.controls.wrap
            .insert('div', '.control-group--subsetter')
            .classed('wc-subheader', true);
        this.controls.filtersHeader
            .append('span')
            .classed('wc-subheader__text', true)
            .text('Filters');
        this.controls.popCount = this.controls.filtersHeader
            .append('span')
            .classed('wc-subheader__content', true); // group other controls

        this.controls.settings = this.controls.controlGroups.filter(function(d) {
            return d.type !== 'subsetter';
        });

        if (this.controls.settings.size()) {
            this.controls.settingsHeader = this.controls.wrap
                .insert('div', '.control-group--dropdown')
                .classed('wc-subheader', true);
            this.controls.settingsHeader
                .append('span')
                .classed('wc-subheader__text', true)
                .text('Settings');
        }
    }

    function updateOptionText(options, callback) {
        options.each(function(d) {
            var option = d3.select(this);
            option.attr('value', d);
            var optionText = callback(d);
            option.text(optionText);
        });
    }

    function addChangeEventListener(select) {
        var chart = this;
        select.on('change', function(d) {
            var _this = this;

            var value = select.selectAll('option:checked').attr('value');

            if (Array.isArray(d.options)) {
                d.options.forEach(function(option) {
                    return chart.controls.stringAccessor(chart.config, option, _this.value);
                });
            } else {
                chart.controls.stringAccessor(chart.config, d.option, this.value);
            }

            chart.draw();
        });
    }

    function labelOptions() {
        var chart = this;
        this.controls.settings.each(function(d) {
            if (d.type === 'dropdown') {
                var controlGroup = d3.select(this);
                var select = controlGroup.selectAll('select');
                var options = select.selectAll('option');

                switch (d.label) {
                    case 'X-axis':
                        updateOptionText.call(chart, options, function(text) {
                            var result = text.split('_').pop();
                            var measure =
                                chart.config.measure_values[text.replace('_'.concat(result), '')];
                            return ''.concat(measure).concat(
                                result
                                    .replace('chg', '')
                                    .replace('f', ' Fold')
                                    .replace('p', ' Percent'),
                                ' Change'
                            );
                        });
                        addChangeEventListener.call(chart, select);
                        break;

                    case 'Y-axis':
                        updateOptionText.call(chart, options, function(text) {
                            var result = text.split('_').pop();
                            var measure =
                                chart.config.measure_values[text.replace('_'.concat(result), '')];
                            return ''.concat(measure).concat(
                                result
                                    .replace('chg', '')
                                    .replace('f', ' Fold')
                                    .replace('p', ' Percent'),
                                ' Change'
                            );
                        });
                        addChangeEventListener.call(chart, select);
                        break;

                    case 'Group':
                        updateOptionText.call(chart, options, function(text) {
                            return text !== 'None'
                                ? chart.config.groups.find(function(group) {
                                      return group.value_col === text;
                                  }).label
                                : 'None';
                        });
                        addChangeEventListener.call(chart, select);
                        break;
                }
            }
        });
    }

    function appendHysteresisPlotContainer() {
        this.hysteresisPlotContainer = this.svg.append('g').classed('wc-hysteresis-plot', true);
    }

    function onLayout() {
        groupControls.call(this);
        labelOptions.call(this);
        appendHysteresisPlotContainer.call(this);
    }

    function onPreprocess() {
        var _this = this;

        // removeNonPositiveRecords
        this.raw_data =
            this.config.x.type === 'log'
                ? this.nepExplorer.data.participants.filter(function(d) {
                      return d[_this.config.y.column] > 0 && d[_this.config.x.column] > 0;
                  })
                : this.nepExplorer.data.participants; // updateYDomain

        this.config.y.domain[0] =
            this.config.x.type === 'log'
                ? d3.min(this.raw_data, function(d) {
                      return d[_this.config.y.column];
                  })
                : 0; // setXLabel

        this.config.x.result = this.config.x.column.split('_').pop();
        this.config.x.measure = this.config.measure_values[
            this.config.x.column.replace('_'.concat(this.config.x.result), '')
        ];
        this.config.x.label = ''.concat(this.config.x.measure).concat(
            this.config.x.result
                .replace('chg', ' ')
                .replace('f', ' Fold ')
                .replace('p', ' Percent '),
            ' Change'
        ); // setYLabel

        this.config.y.result = this.config.y.column.split('_').pop();
        this.config.y.measure = this.config.measure_values[
            this.config.y.column.replace('_'.concat(this.config.y.result), '')
        ];
        this.config.y.label = ''.concat(this.config.y.measure).concat(
            this.config.y.result
                .replace('chg', ' ')
                .replace('f', ' Fold ')
                .replace('p', ' Percent '),
            'Change'
        ); // chooseCriteria

        this.config.criteria = /_chg/.test(this.config.y.column)
            ? this.config.kdigo_dc_criteria // absolute change
            : this.config.kdigo_criteria; // fold/percent change
        // updateKdigoHeader

        this.nepExplorer.containers.kdigoHeader.text(
            this.config.criteria === this.config.kdigo_criteria
                ? 'KDIGO Scatter Plot'
                : 'KDIGO-DC Scatter Plot'
        ); // defineKdigoStage

        this.raw_data.forEach(function(d) {
            var kdigo = _this.config.criteria
                .slice()
                .sort(function(a, b) {
                    return b.x - a.x;
                })
                .find(function(criterion) {
                    return (
                        criterion.x <= d[_this.config.x.column] ||
                        criterion.y <= d[_this.config.y.column]
                    );
                }).label;

            d.kdigo = kdigo
                ? kdigo.replace(/stage_(\d)/, 'Stage $1 AKI').replace('no_aki', 'No AKI')
                : '???';
        }); // setLegendLabel

        this.config.legend.label =
            this.config.color_by && this.config.color_by !== 'None'
                ? this.config.groups.find(function(group) {
                      return group.value_col === _this.config.color_by;
                  }).label
                : 'All Participants';
    }

    function onDatatransform() {}

    function updatePopCount() {
        this.controls.popCount.html(
            "<span class = 'numerator'>"
                .concat(this.filtered_data.length, "</span> of <span class = 'numerator'>")
                .concat(this.nepExplorer.data.participants.length, '</span> participants shown.')
        );
    }

    function updateDomains() {
        this.x_dom[1] = Math.max(this.x_dom[1], 3);
        this.y_dom[1] = Math.max(this.y_dom[1], 75);
    }

    function onDraw() {
        updatePopCount.call(this);
        updateDomains.call(this);
    }

    function metadata() {
        var _this = this;

        var metadata = this.config.criteria
            .slice()
            .sort(function(a, b) {
                return a.x - b.x;
            })
            .map(function(d, i) {
                var next =
                    i < _this.config.criteria.length - 1
                        ? _this.config.criteria[i + 1]
                        : {
                              x: _this.x_dom[1],
                              y: _this.y_dom[1]
                          };
                d.dimensions = [
                    [_this.x_dom[0], next.x],
                    [_this.y_dom[0], next.y]
                ];
                return d;
            })
            .reverse();
        return metadata;
    }

    function drawKdigoStages() {
        var _this = this;

        this.svg.selectAll('.kdigo-stages').remove();
        var g = this.svg.insert('g', '.axis').classed('kdigo-stages', true);
        var metadata$1 = metadata.call(this);
        var rects = g
            .selectAll('rect')
            .data(metadata$1)
            .enter()
            .append('rect')
            .classed('kdigo-stage', true)
            .attr({
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
                'clip-path': 'url(#'.concat(this.id, ')')
            });
        rects.append('title').text(function(d) {
            return d.label;
        });
    }

    function highlightPoint() {
        var _this = this;

        this.marks
            .find(function(mark) {
                return mark.type === 'circle';
            })
            .circles.classed('wc-selected', function(d) {
                return d.key === _this.nepExplorer.participant;
            });
    }

    function defineVisitLevelData() {
        var _this = this;

        var x_data = this.nepExplorer.data.participant.values.find(function(d) {
            return d.key === _this.config.x.measure;
        }).values.data;
        var x_studydays = x_data.map(function(d) {
            return d.studyday;
        });
        var y_data = this.nepExplorer.data.participant.values.find(function(d) {
            return d.key === _this.config.y.measure;
        }).values.data;
        var y_studydays = y_data.map(function(d) {
            return d.studyday;
        });
        var studydays = x_studydays.filter(function(studyday) {
            return y_studydays.includes(studyday);
        }); // Get coordinates by study day.

        var visits = studydays
            .map(function(studyday) {
                var visitObj = {
                    studyday: studyday
                }; // Get visit value.

                visitObj.visit = _this.config.visit_col
                    ? x_data.find(function(d) {
                          return d.studyday === studyday;
                      })[_this.config.visit_col]
                    : null;
                visitObj.visitn = _this.config.visitn_col
                    ? x_data.find(function(d) {
                          return d.studyday === studyday;
                      })[_this.config.visitn_col]
                    : null; // Get x coordinate.

                var xMatch = x_data.find(function(d) {
                    return d.studyday === studyday;
                });
                visitObj.x = xMatch[_this.config.x.result];
                visitObj.xClamped = Math.max(visitObj.x, _this.config.x.domain[0]);
                visitObj.xIsClamped = visitObj.x !== visitObj.xClamped; // Get y coordinate.

                var yMatch = y_data.find(function(d) {
                    return d.studyday === studyday;
                });
                visitObj.y = yMatch[_this.config.y.result];
                visitObj.yClamped = Math.max(visitObj.y, _this.config.y.domain[0]);
                visitObj.yIsClamped = visitObj.y !== visitObj.yClamped; // Get color value.

                if (_this.config.color_by)
                    visitObj[_this.config.color_by] = x_data[0][_this.config.color_by]; // Get KDIGO stage.

                var kdigo = _this.config.criteria
                    .slice()
                    .sort(function(a, b) {
                        return b.x - a.x;
                    })
                    .find(function(criterion) {
                        return criterion.x <= visitObj.x || criterion.y <= visitObj.y;
                    }).label;

                visitObj.kdigo = kdigo
                    ? kdigo.replace(/stage_(\d)/, 'Stage $1 AKI').replace('no_aki', 'No AKI')
                    : '???';
                return visitObj;
            })
            .sort(function(a, b) {
                return a.studyday - b.studyday;
            })
            .filter(function(d) {
                return !isNaN(d.x) && !isNaN(d.y);
            });
        return visits;
    }

    function drawPath() {
        var _this = this;

        // Define path.
        var line = d3.svg
            .line()
            .x(function(d) {
                return _this.x(d.xClamped);
            })
            .y(function(d) {
                return _this.y(d.yClamped);
            }); // Draw path.

        var visitPath = this.hysteresisPlotContainer
            .append('path')
            .attr('class', 'participant-visits')
            .datum(this.nepExplorer.data.participant.visits)
            .attr('d', line)
            .attr('stroke', function(d) {
                return _this.colorScale(_this.nepExplorer.data.participant[_this.config.color_by]);
            })
            .attr('stroke-width', '2px')
            .attr('fill', 'none'); // Animate path.

        var totalLength = visitPath.node().getTotalLength();
        visitPath
            .attr('stroke-dasharray', totalLength + ' ' + totalLength)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .duration(2000)
            .ease('linear')
            .attr('stroke-dashoffset', 0);
        return visitPath;
    }

    function drawPoints() {
        var _this = this;

        var visitPoints = this.hysteresisPlotContainer
            .selectAll('g.visit-point')
            .data(this.nepExplorer.data.participant.visits)
            .enter()
            .append('g')
            .attr('class', 'visit-point');
        visitPoints
            .append('circle')
            .attr('class', 'participant-visits')
            .attr('r', 0)
            .attr('stroke', function(d) {
                return _this.colorScale(d[_this.config.color_by]);
            })
            .attr('stroke-width', 1)
            .attr('cx', function(d) {
                return _this.x(d.xClamped);
            })
            .attr('cy', function(d) {
                return _this.y(d.yClamped);
            })
            .attr('fill', function(d) {
                return _this.colorScale(d[_this.config.color_by]);
            })
            .attr('fill-opacity', function(d) {
                return d.xIsClamped || d.yIsClamped ? 0.25 : 0.75;
            })
            .transition()
            .delay(2000)
            .duration(200)
            .attr('r', 4); //custom titles for points on mouseover

        visitPoints.append('title').text(function(d) {
            var studyDay_label = 'Study day: ' + d.studyDay + '\n';
            var visitn_label = d.visitn ? 'Visit Number: ' + d.visitn + '\n' : '';
            var visit_label = d.visit ? 'Visit: ' + d.visit + '\n' : '';
            var x_label = _this.config.x.label + ': ' + d3.format('0.3f')(d.x) + '\n';
            var y_label = _this.config.y.label + ': ' + d3.format('0.3f')(d.y);
            var kdigo_label = d.kdigo ? '\nKDIGO: ' + d.kdigo : '';
            return studyDay_label + visit_label + visitn_label + x_label + y_label + kdigo_label;
        });
        return visitPoints;
    }

    function drawHysteresisPlot() {
        this.nepExplorer.data.participant.visits = defineVisitLevelData.call(this);
        this.hysteresisPlotContainer.selectAll('*').remove();
        this.visitPath = drawPath.call(this);
        this.visitPoints = drawPoints.call(this);
    }

    function updateDetailsHeader() {
        this.nepExplorer.containers.detailsHeaderText.text('Participant Details');
    }

    function addClearFunctionality() {
        var _this = this;

        var containers = this.nepExplorer.containers;
        containers.detailsClear.classed('wc-hidden', false).on('click', function() {
            containers.detailsHeaderText.text('Click a point to view participant details.');
            containers.detailsClear.classed('wc-hidden', true);
            containers.detailsParticipant
                .classed('wc-hidden', true)
                .selectAll('*')
                .remove();
            containers.timeSeries.classed('wc-hidden', true);

            _this.marks
                .find(function(mark) {
                    return mark.type === 'circle';
                })
                .circles.classed('wc-selected', false);

            _this.hysteresisPlotContainer.selectAll('*').remove();
        });
    }

    function displayParticipantDetails() {
        var nepExplorer = this.nepExplorer;
        nepExplorer.containers.detailsParticipant
            .classed('wc-hidden', false)
            .selectAll('li')
            .remove();
        var lis = nepExplorer.containers.detailsParticipant
            .selectAll('li')
            .data(nepExplorer.settings.synced.details)
            .enter()
            .append('li')
            .classed('wc-details__li', true);
        lis.append('div')
            .classed('wc-details__label', true)
            .text(function(d) {
                return d.label;
            });
        lis.append('div')
            .classed('wc-details__value', true)
            .text(function(d) {
                return nepExplorer.data.participant[d.value_col];
            });
    }

    function drawTimeSeriesCharts() {
        var nepExplorer = this.nepExplorer;
        nepExplorer.containers.timeSeries.classed('wc-hidden', false);

        var _loop = function _loop(name) {
            var chart = nepExplorer.charts[name];
            var chartMeasures = chart.config.measures.map(function(measure) {
                return nepExplorer.settings.synced.measure_values[measure];
            });
            var chartData = d3.merge(
                nepExplorer.data.participant.values
                    .filter(function(d) {
                        return chartMeasures.includes(d.key);
                    })
                    .map(function(d) {
                        return d.values.data;
                    })
            );

            if (chartData.length) {
                if (chart.initialized) chart.draw(chartData);
                else chart.init(chartData);
            } else {
                delete nepExplorer.charts[chart];
                console.warn(
                    '[ '.concat(
                        measures.join(', '),
                        ' ] do not exist in the data. The associated chart will not be displayed.'
                    )
                );
            }
        };

        for (var name in nepExplorer.charts) {
            _loop(name);
        }
    }

    function displayParticipant() {
        var nepExplorer = this.nepExplorer;

        if (nepExplorer.participant) {
            nepExplorer.data.participant = nepExplorer.data.participants.find(function(d) {
                return d.key === nepExplorer.participant;
            });
            highlightPoint.call(this);
            drawHysteresisPlot.call(this);
            updateDetailsHeader.call(this);
            addClearFunctionality.call(this);
            displayParticipantDetails.call(this);
            drawTimeSeriesCharts.call(this);
        }
    }

    function addPointClick() {
        var _this = this;

        this.marks
            .find(function(mark) {
                return mark.type === 'circle';
            })
            .circles.on('mouseover', function(d) {
                d3$1.select(this).classed('wc-highlighted', true);
            })
            .on('mouseout', function(d) {
                d3$1.select(this).classed('wc-highlighted', false);
            })
            .on('click', function(d) {
                // Attach participant value.
                _this.nepExplorer.participant = d.key;
                displayParticipant.call(_this);
            });
    }

    function addKdigoLegend() {
        var _this = this;

        this.kdigoSummary = this.config.criteria.map(function(stage) {
            var datum = _objectSpread2({}, stage);

            datum.n = _this.filtered_data.filter(function(d) {
                return d.kdigo === datum.label;
            }).length;
            datum.rate = datum.n / _this.filtered_data.length;
            datum.pct = d3.format('.1%')(datum.rate);
            return datum;
        });

        if (this.kdigoLegend) {
            this.kdigoLegend.config.headers[0] =
                this.config.criteria === this.config.kdigo_criteria ? 'KDIGO' : 'KDIGO-DC';
            this.kdigoLegend.draw(this.kdigoSummary);
        } else {
            this.kdigoLegend = webcharts.createTable(
                this.nepExplorer.containers.kdigoLegend.node(),
                {
                    cols: ['label', 'n', 'pct'],
                    headers: ['KDIGO', '#', '%'],
                    searchable: false,
                    sortable: false,
                    pagination: false,
                    exportable: false,
                    applyCSS: false
                }
            );
            this.kdigoLegend.kdigoChart = this;
            this.kdigoLegend.on('init', function() {
                this.initialized = true;
            });
            this.kdigoLegend.on('draw', function() {
                var _this2 = this;

                d3.select(this.div).style('top', this.kdigoChart.margin.top);
                this.wrap
                    .selectAll('tbody td')
                    .filter(function(d) {
                        return d.col === 'label';
                    })
                    .style({
                        background: function background(d) {
                            return _this2.data.raw.find(function(di) {
                                return di[d.col] === d.text;
                            }).color;
                        }
                    });
            });
            this.kdigoLegend.init(this.kdigoSummary);
        }
    }

    function moveLegend() {
        //d3.select(this.div).node().appendChild(
        this.legend.classed('legend--kdigo', true).style('margin-left', this.margin.left); //        .node()
        //);
    }

    function onResize() {
        drawKdigoStages.call(this);
        addPointClick.call(this);
        displayParticipant.call(this);
        addKdigoLegend.call(this);
        moveLegend.call(this);
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

    function setYDomain() {
        var _this = this;

        if (this.config.chart === 'uln')
            this.y_dom[1] = Math.max(
                this.config.y.domain[1],
                d3.max(this.filtered_data, function(d) {
                    return d[_this.config.y.column];
                })
            );

        if (this.config.chart === 'bp') {
            this.y_dom[0] = Math.min(
                this.config.y.domain[0],
                d3.min(this.filtered_data, function(d) {
                    return d[_this.config.y.column];
                })
            );
            this.y_dom[1] = Math.max(
                this.config.y.domain[1],
                d3.max(this.filtered_data, function(d) {
                    return d[_this.config.y.column];
                })
            );
        }

        if (this.config.chart === 'albcreat')
            this.y_dom[1] = Math.max(
                this.config.y.domain[1],
                d3.max(this.filtered_data, function(d) {
                    return d[_this.config.y.column];
                })
            );
    }

    function onDraw$1() {
        setYDomain.call(this);
    }

    function drawReferenceLine() {
        var _this = this;

        this.svg.selectAll('.wc-reference-lines').remove();

        if (this.config.reference_lines) {
            var g = this.svg.insert('g', '.point-supergroup').classed('wc-reference-lines', true);
            var reference_lines = this.config.reference_lines.filter(function(reference_line) {
                return _this.y_dom[0] <= reference_line.y && reference_line.y <= _this.y_dom[1];
            }); // lines

            g.selectAll('line')
                .data(reference_lines)
                .enter()
                .append('line')
                .classed('wc-reference-line', true)
                .attr({
                    x2: this.plot_width,
                    y1: function y1(d) {
                        return _this.y(d.y);
                    },
                    y2: function y2(d) {
                        return _this.y(d.y);
                    }
                })
                .append('title')
                .classed('wc-reference-tooltip', true)
                .text(function(d) {
                    return typeof d.tooltip === 'string' ? d.tooltip : d.tooltip(_this);
                }); // labels

            g.selectAll('text')
                .data(reference_lines)
                .enter()
                .append('text')
                .classed('wc-reference-label', true)
                .attr({
                    x: this.plot_width,
                    y: function y(d) {
                        return _this.y(d.y);
                    },
                    dy: -4
                })
                .text(function(d) {
                    return d.label;
                })
                .append('title')
                .classed('wc-reference-tooltip', true)
                .text(function(d) {
                    return typeof d.tooltip === 'string' ? d.tooltip : d.tooltip(_this);
                });
        }
    }

    function drawDifference() {
        var _this = this;

        this.svg.selectAll('.wc-diffs').remove();

        if (this.config.diff) {
            var g = this.svg.insert('g', '.point-supergroup').classed('wc-diffs', true);
            var mark = this.marks.find(function(mark) {
                return mark.type === 'circle';
            });
            var matches = d3
                .nest()
                .key(function(d) {
                    return d.total;
                })
                .rollup(function(data) {
                    var datum = {
                        n: data.length
                    };

                    if (data.length > 1) {
                        datum.measure1 = data[0].values.raw[0].measure;
                        datum.y1 = data[0].values.y;
                        datum.result1 = data[0].values.raw[0].result;
                        datum.measure2 = data[1].values.raw[0].measure;
                        datum.y2 = data[1].values.y;
                        datum.result2 = data[1].values.raw[0].result;
                        datum.diff = datum.y2 - datum.y1;
                    }

                    return datum;
                })
                .entries(mark.data)
                .filter(function(d) {
                    return d.values.n > 1;
                });
            var diffs = g
                .selectAll('g')
                .data(matches)
                .enter()
                .append('g')
                .classed('wc-diff', true);
            diffs
                .append('line')
                .classed('wc-visible-line', true)
                .attr({
                    x1: function x1(d) {
                        return _this.x(+d.key);
                    },
                    x2: function x2(d) {
                        return _this.x(+d.key);
                    },
                    y1: function y1(d) {
                        return _this.y(d.values.y1);
                    },
                    y2: function y2(d) {
                        return _this.y(d.values.y2);
                    }
                });
            var hoverLines = diffs
                .append('line')
                .classed('wc-hover-line', true)
                .attr({
                    x1: function x1(d) {
                        return _this.x(+d.key);
                    },
                    x2: function x2(d) {
                        return _this.x(+d.key);
                    },
                    y1: function y1(d) {
                        return _this.y(d.values.y1);
                    },
                    y2: function y2(d) {
                        return _this.y(d.values.y2);
                    }
                });
            hoverLines.append('title').text(function(d) {
                return 'Study day '
                    .concat(d.key, '\n')
                    .concat(d.values.measure1, ': ')
                    .concat(d.values.y1, ' (')
                    .concat(d.values.result1, ')\n')
                    .concat(d.values.measure2, ': ')
                    .concat(d.values.y2, ' (')
                    .concat(d.values.result2, ')\nDifference: ')
                    .concat(d.values.diff);
            });
            hoverLines
                .on('mouseover', function(d) {
                    d3.select(this.parentNode)
                        .select('.wc-visible-line')
                        .classed('wc-hovered', true);
                })
                .on('mouseout', function(d) {
                    d3.select(this.parentNode)
                        .select('.wc-visible-line')
                        .classed('wc-hovered', false);
                });
        }
    }

    function moveLegend$1() {
        this.div.appendChild(this.legend.classed('legend--time-series', true).node());
    }

    function onResize$1() {
        drawReferenceLine.call(this);
        drawDifference.call(this);
        moveLegend$1.call(this);
    }

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
        }; // settings

        nepExplorer.settings.merged = Object.assign(
            {},
            configuration.renderer(),
            configuration.kdigoScatterPlot(),
            nepExplorer.settings.user
        );
        nepExplorer.settings.synced = configuration.syncKdigoScatterPlot(
            nepExplorer.settings.merged
        ); // controls

        nepExplorer.settings.controls = {
            inputs: configuration.syncControlInputs(
                configuration.controlInputs(),
                nepExplorer.settings.synced
            )
        };
        nepExplorer.controls = webcharts.createControls(
            nepExplorer.containers.controls.node(),
            nepExplorer.settings.controls
        ); // chart

        nepExplorer.kdigoScatterPlot = webcharts.createChart(
            nepExplorer.containers.kdigoScatterPlot.node(),
            nepExplorer.settings.synced,
            nepExplorer.controls
        );

        for (var callback in kdigoScatterPlotCallbacks) {
            nepExplorer.kdigoScatterPlot.on(
                callback.substring(2).toLowerCase(),
                kdigoScatterPlotCallbacks[callback]
            );
        } // time series

        Object.keys(configuration.timeSeriesCharts).forEach(function(chart) {
            var container = nepExplorer.containers.timeSeries
                .append('div')
                .classed(
                    'wc-subcomponent wc-subcomponent--chart wc-subcomponent--time-series-chart wc-subcomponent--'.concat(
                        chart
                    ),
                    true
                );
            var mergedSettings = Object.assign(
                {},
                configuration.renderer(),
                configuration.timeSeries(chart) //nepExplorer.settings.user
            ); //const syncedSettings = configuration.syncTimeSeries(mergedSettings);

            nepExplorer.containers[''.concat(chart, 'Container')] = container;
            nepExplorer.containers[''.concat(chart, 'Header')] = nepExplorer.containers[
                ''.concat(chart, 'Container')
            ]
                .append('div')
                .classed('wc-header wc-header--'.concat(chart), true)
                .text(mergedSettings.title); //.text(syncedSettings.title);

            nepExplorer.containers[chart] = container
                .append('div')
                .classed('wc-chart-container wc-chart-container--'.concat(chart), true);
            var timeSeries = webcharts.createChart(
                nepExplorer.containers[chart].node(),
                mergedSettings //syncedSettings
            );

            for (var _callback in timeSeriesCallbacks) {
                timeSeries.on(_callback.substring(2).toLowerCase(), timeSeriesCallbacks[_callback]);
            }

            nepExplorer.charts[chart] = timeSeries;
        });
        return nepExplorer;
    }

    return nepExplorer;
});
