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
        };
        containers.controls = containers.main
            .append('div')
            .classed('wc-component wc-component--controls', true); // population section - KDIGO scatter plot, KDIGO legend/frequency table

        containers.population = containers.main
            .append('div')
            .classed('wc-section wc-section--population', true);
        containers.kdigoHeader = containers.population
            .append('div')
            .classed('wc-header wc-header--kdigo-scatter-plot', true)
            .text('KDIGO Scatter Plot');
        containers.kdigoScatterPlot = containers.population
            .append('div')
            .classed('wc-component wc-component--kdigo-scatter-plot', true);
        containers.kdigoLegend = containers.population
            .append('div')
            .classed('wc-component wc-component--kdigo-legend', true); // participant section - participant details, time series charts

        containers.participant = containers.main
            .append('div')
            .classed('wc-section wc-section--participant', true);
        containers.detailsContainer = containers.participant
            .append('div')
            .classed('wc-component wc-component--details-container', true);
        containers.detailsHeader = containers.detailsContainer
            .append('div')
            .classed('wc-header wc-header--details', true)
            .text('Click a point to view participant details.');
        containers.detailsClear = containers.detailsContainer
            .append('button')
            .classed('wc-component__details-clear wc-hidden', true)
            .text('Clear');
        containers.detailsParticipant = containers.detailsContainer
            .append('ul')
            .classed('wc-component__details-participant wc-hidden', true);
        containers.timeSeries = containers.participant
            .append('div')
            .classed('wc-component wc-component--time-series wc-hidden', true);
        return containers;
    }

    function styles() {
        var styles = [
            /***--------------------------------------------------------------------------------------\
      universal styles
      \--------------------------------------------------------------------------------------***/
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
            '.wc-section {',
            '    display: inline-block;',
            '}',
            '.wc-component {',
            '    display: inline-block;',
            '    width: 100%;',
            '}',
            /***--------------------------------------------------------------------------------------\
      left side
      \--------------------------------------------------------------------------------------***/
            //'.wc-section--population {',
            //'    width: 48%;',
            //'    float: left;',
            //'}',
            '.wc-component--kdigo-scatter-plot circle.wc-data-mark {',
            '    cursor: pointer;',
            '    stroke: black;',
            '    fill-opacity: 1;',
            '    stroke-width: 1;',
            '}',
            '.wc-component--kdigo-scatter-plot circle.wc-data-mark:hover {',
            '    stroke-width: 3;',
            '}',
            '.wc-component--kdigo-scatter-plot circle.wc-data-mark.wc-selected {',
            '    stroke-width: 3;',
            '}',
            '.kdigo-stage {',
            '    stroke: black;',
            '}',
            '.wc-component--kdigo-scatter-plot .tick line {',
            '    stroke-opacity: .4;',
            '}',
            '.wc-component--kdigo-legend .interactivity {',
            '    display: none;',
            '}',
            '.wc-component--kdigo-legend table {',
            '    border-collapse: collapse;',
            '}',
            '.wc-component--kdigo-legend thead {',
            '    border-top: 2px solid #999;',
            '    border-bottom: 2px solid #999;',
            '}',
            '.wc-component--kdigo-legend thead tr {',
            '    padding: 0.1em;',
            '}',
            '.wc-component--kdigo-legend tbody {',
            '    border-bottom: 2px solid #999;',
            '}',
            '.wc-component--kdigo-legend tbody {',
            '    border-bottom: 2px solid #999;',
            '}',
            '.wc-component--kdigo-legend tbody tr {',
            '    padding: 0.1em;',
            '}',
            '.wc-component--kdigo-legend tbody td {',
            '    text-align: center;',
            '    font-size: 0.9em;',
            '    padding: 0 0.5em 0 0.5em;',
            '}',
            /***--------------------------------------------------------------------------------------\
      right side
      \--------------------------------------------------------------------------------------***/
            //'.wc-section--participant {',
            //'    width: 48%;',
            //'    float: right;',
            //'}',
            '.wc-header {',
            '    border-top: 2px solid black;',
            '    border-bottom: 2px solid black;',
            '    padding: 0.2em;',
            '    font-weight: bold;',
            '}',
            '.wc-component__details-clear {',
            '    float: right;',
            '    margin: 0.5em;',
            '}',
            '.wc-component__details-participant {',
            '    list-style: none;',
            '    padding: 0;',
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
            '.wc-component--time-series-chart {',
            '    width: 100%;',
            '}',
            '.wc-diff .wc-hover-line {',
            '    stroke: #fff;',
            '    stroke-width: 16;',
            '    stroke-opacity: 0;',
            '}',
            '.wc-diff .wc-visible-line {',
            '    stroke: #aaa;',
            '    stroke-width: 2;',
            '    stroke-dasharray: 2,2;',
            '}',
            '.wc-diff .wc-visible-line.wc-hovered {',
            '    stroke: #777;',
            '    stroke-width: 4;',
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

        participantLevel.forEach(function(d) {
            var datum = data.find(function(di) {
                return di[settings.id_col] === d.key;
            }); // participant details

            settings.details.forEach(function(detail) {
                d[detail.value_col] = datum[detail.value_col];
            }); // x-axis

            var creat = d.values.find(function(di) {
                return di.key === settings.measure_values.creat;
            });
            d.creat_fchg = creat ? creat.values.max_fchg : null;
            var cystatc = d.values.find(function(di) {
                return di.key === settings.measure_values.cystatc;
            });
            d.cystatc_fchg = cystatc ? cystatc.values.max_fchg : null; // y-axis

            var egfr_creat = d.values.find(function(di) {
                return di.key === settings.measure_values.egfr_creat;
            });
            d.egfr_creat_chg = egfr_creat ? (egfr_creat.values.max_fchg - 1) * 100 : null;
            var egfr_cystatc = d.values.find(function(di) {
                return di.key === settings.measure_values.egfr_cystatc;
            });
            d.egfr_cystatc_chg = egfr_cystatc ? egfr_cystatc.values.max_chg : null; // KDIGO stage

            var kdigo = Object.keys(settings.kdigo_criteria)
                .sort(d3.descending)
                .find(function(key) {
                    var criterion = settings.kdigo_criteria[key];
                    return (
                        criterion.creat_fchg <= d.creat_fchg ||
                        criterion.egfr_creat_chg <= d.egfr_creat_chg
                    );
                });
            d.kdigo = kdigo
                ? kdigo.replace(/stage_(\d)/, 'Stage $1 AKI').replace('no_aki', 'No AKI')
                : '???'; // color

            d.creat_fn = d.creat_chg >= 0.3 ? 1 : 0;
            d.cystatc_fn = d.cystatc_chg >= 0.3 ? 1 : 0;
        });
        return participantLevel;
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

    function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
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

    function _nonIterableRest() {
        throw new TypeError('Invalid attempt to destructure non-iterable instance');
    }

    function addKdigoLegend() {
        var _this = this;

        this.data.kdigoSummary = Object.keys(this.settings.synced.kdigo_criteria).map(function(
            stage
        ) {
            var datum = _objectSpread2({}, _this.settings.synced.kdigo_criteria[stage]);

            datum.label = stage.replace(/stage_(\d)/, 'Stage $1 AKI').replace('no_aki', 'No AKI');
            datum.n = _this.data.participants.filter(function(d) {
                return d.kdigo === datum.label;
            }).length;
            datum.rate = datum.n / _this.data.participants.length;
            datum.pct = d3.format('.1%')(datum.rate);
            return datum;
        });
        this.kdigoLegend = webcharts.createTable(this.containers.kdigoLegend.node(), {
            cols: ['label', 'n', 'pct'],
            headers: ['KDIGO', '#', '%'],
            searchable: false,
            sortable: false,
            pagination: false,
            exportable: false,
            applyCSS: false
        });
        this.kdigoLegend.on('init', function() {
            this.initialized = true;
        });
        this.kdigoLegend.on('draw', function() {
            var _this2 = this;

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
        if (this.kdigoLegend.initialized) this.kdigoLegend.draw(this.data.kdigoSummary);
        else this.kdigoLegend.init(this.data.kdigoSummary);
    }

    function addClearFunctionality() {
        var _this = this;

        this.containers.detailsClear.classed('wc-hidden', false).on('click', function() {
            _this.containers.detailsHeader.text('Click a point to view participant details.');

            _this.containers.detailsClear.classed('wc-hidden', true);

            _this.containers.detailsParticipant
                .classed('wc-hidden', true)
                .selectAll('*')
                .remove();

            _this.containers.timeSeries.classed('wc-hidden', true);

            _this.kdigoScatterPlot.marks
                .find(function(mark) {
                    return mark.type === 'circle';
                })
                .circles.classed('wc-selected', false);
        });
    }

    function displayParticipantDetails(id) {
        var participant = this.data.participants.find(function(d) {
            return d.key === id;
        });
        this.containers.detailsParticipant
            .classed('wc-hidden', false)
            .selectAll('li')
            .remove();
        var lis = this.containers.detailsParticipant
            .selectAll('li')
            .data(this.settings.synced.details)
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
                return participant[d.value_col];
            });
    }

    function drawTimeSeriesCharts(id) {
        var _this = this;

        var participant = this.data.participants.find(function(d) {
            return d.key === id;
        });
        this.containers.timeSeries.classed('wc-hidden', false);

        var _loop = function _loop(name) {
            var chart = _this.charts[name];
            var chartMeasures = chart.config.measures.map(function(measure) {
                return _this.settings.synced.measure_values[measure];
            });
            var chartData = d3.merge(
                participant.values
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
                delete _this.charts[chart];
                console.warn(
                    '[ '.concat(
                        measures.join(', '),
                        ' ] do not exist in the data. The associated chart will not be displayed.'
                    )
                );
            }
        };

        for (var name in this.charts) {
            _loop(name);
        }
    }

    function init(data, id) {
        this.data = {
            data: data,
            selected: id
        };
        addVariables(this);
        this.data.participants = defineParticipantLevelData(this);
        this.kdigoScatterPlot.nepExplorer = this;
        this.kdigoScatterPlot.init(this.data.participants);
        addKdigoLegend.call(this); // Display specified participant on initialization.

        if (id) {
            this.kdigoScatterPlot.marks
                .find(function(mark) {
                    return mark.type === 'circle';
                })
                .circles.classed('wc-selected', function(d) {
                    return d.key === id;
                });
            this.containers.detailsHeader.text('Participant Details');
            addClearFunctionality.call(this);
            displayParticipantDetails.call(this, id);
            drawTimeSeriesCharts.call(this, id);
        }
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
            groups: [],
            details: [
                {
                    value_col: 'AGE',
                    label: 'Age'
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
            baseline_value: 'Y',
            kdigo_criteria: {
                no_aki: {
                    creat_fchg: 0,
                    egfr_creat_chg: 0,
                    color: 'white'
                },
                stage_1: {
                    creat_fchg: 1.5,
                    egfr_creat_chg: 25,
                    color: 'yellow'
                },
                stage_2: {
                    creat_fchg: 2,
                    egfr_creat_chg: 50,
                    color: 'orange'
                },
                stage_3: {
                    creat_fchg: 3,
                    egfr_creat_chg: 75,
                    color: 'red'
                }
            },
            kdigo_dc_criteria: {
                stage_1: {
                    creat: 0.3,
                    egfr: 25,
                    color: 'yellow'
                },
                stage_2: {
                    creat: 0.7,
                    egfr: 50,
                    color: 'orange'
                },
                stage_3: {
                    creat: 1.2,
                    egfr: 75,
                    color: 'red'
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
            marks: [
                {
                    type: 'circle',
                    per: ['key'],
                    tooltip: '[key]: $x,$y'
                }
            ],
            //resizable: false,
            aspect: 2,
            gridlines: 'xy'
        };
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
                        return detail.value_col === detail.value_col;
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
            settings.details = typeof settings.details == 'string' ? [settings.details] : []; // Use default details if detailsIf [settings.details] is not specified:

        if (!settings.details) settings.details = details;
        else {
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
            settings.details = details;
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

    function creat_cystatc() {
        return {
            title: 'Percent Change from Baseline',
            measures: ['creat', 'cystatc'],
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
            y: {
                column: 'result',
                label: 'mmHg'
            }
        };
    }

    function albcreat() {
        return {
            title: 'Albumin/Creatinine Ratio',
            measures: ['albcreat'],
            y: {
                column: 'result',
                label: 'mg/g'
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
        var chartSettings = timeSeriesCharts[chart]();
        var settings = {
            title: chartSettings.title,
            diff: !!chartSettings.diff,
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
                mark: 'circle'
            },
            gridlines: 'xy',
            //resizable: false,
            aspect: 3
        };
        return settings;
    }

    function syncSettings(settings) {
        return settings;
    }

    function controlInputs() {
        return [];
    }

    function syncControlInputs(controlInputs, settings) {
        //Add filters to default controls.
        if (Array.isArray(settings.filters) && settings.filters.length > 0) {
            settings.filters.forEach(function(filter) {
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
        syncKdigoScatterPlot: syncKdigoScatterPlot,
        timeSeries: timeSeries,
        timeSeriesCharts: timeSeriesCharts,
        syncTimeSeries: syncSettings,
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

    // TODO: use settings to define KDIGO dimensions
    function metadata() {
        //console.log(this.config.kdigo_criteria);
        return [
            {
                label: 'KDIGO Stage 3',
                dimensions: [
                    [1, this.x_dom[1]],
                    [0, this.y_dom[1]]
                ],
                color: 'red'
            },
            {
                label: 'KDIGO Stage 2',
                dimensions: [
                    [1, 3],
                    [0, 75]
                ],
                color: 'orange'
            },
            {
                label: 'KDIGO Stage 1',
                dimensions: [
                    [1, 2],
                    [0, 50]
                ],
                color: 'yellow'
            },
            {
                label: '',
                dimensions: [
                    [1, 1.5],
                    [0, 25]
                ],
                color: 'white'
            }
        ];
    }

    // TODO: add table by KDIGO stage

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

    function addPointClick() {
        var chart = this;
        var points = this.marks.find(function(mark) {
            return mark.type === 'circle';
        }).circles;
        points
            .on('mouseover', function(d) {
                d3$1.select(this).classed('wc-highlighted', true);
            })
            .on('mouseout', function(d) {
                d3$1.select(this).classed('wc-highlighted', false);
            })
            .on('click', function(d) {
                points.classed('wc-selected', false);
                d3$1.select(this).classed('wc-selected', true);
                chart.nepExplorer.selected = d.key;
                chart.nepExplorer.containers.detailsHeader.text('Participant Details');
                addClearFunctionality.call(chart.nepExplorer);
                displayParticipantDetails.call(chart.nepExplorer, d.key);
                drawTimeSeriesCharts.call(chart.nepExplorer, d.key);
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

    function onDraw$1() {
        if (this.config.y.column === 'xuln')
            this.y_dom[1] = Math.max(
                this.config.y.domain[1],
                d3.max(this.filtered_data, function(d) {
                    return d.xuln;
                })
            );
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

    function onResize$1() {
        drawDifference.call(this);
        this.div.appendChild(this.legend.node());
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
        }; // KDIGO scatter plot

        nepExplorer.settings.merged = Object.assign(
            {},
            configuration.renderer(),
            configuration.kdigoScatterPlot(),
            nepExplorer.settings.user
        );
        nepExplorer.settings.synced = configuration.syncKdigoScatterPlot(
            nepExplorer.settings.merged
        );
        nepExplorer.kdigoScatterPlot = webcharts.createChart(
            nepExplorer.containers.kdigoScatterPlot.node(),
            nepExplorer.settings.synced
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
                configuration.timeSeries(chart),
                nepExplorer.settings.user
            );
            var syncedSettings = configuration.syncTimeSeries(mergedSettings);
            console.log(syncedSettings.title);
            nepExplorer.containers[''.concat(chart, 'Container')] = container;
            nepExplorer.containers[''.concat(chart, 'Header')] = nepExplorer.containers[
                ''.concat(chart, 'Container')
            ]
                .append('div')
                .classed('wc-header wc-header--'.concat(chart), true)
                .text(syncedSettings.title);
            nepExplorer.containers[chart] = container
                .append('div')
                .classed('wc-chart-container wc-chart-container--'.concat(chart), true);
            var timeSeries = webcharts.createChart(
                nepExplorer.containers[chart].node(),
                syncedSettings
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
