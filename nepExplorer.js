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

                var o = Object(this);

                // 2. Let len be ? ToLength(? Get(O, 'length')).
                var len = o.length >>> 0;

                // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }

                // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                var thisArg = arguments[1];

                // 5. Let k be 0.
                var k = 0;

                // 6. Repeat, while k < len
                while (k < len) {
                    // a. Let Pk be ! ToString(k).
                    // b. Let kValue be ? Get(O, Pk).
                    // c. Let testResult be ToBoolean(? Call(predicate, T, � kValue, k, O �)).
                    // d. If testResult is true, return kValue.
                    var kValue = o[k];
                    if (predicate.call(thisArg, kValue, k, o)) {
                        return kValue;
                    }
                    // e. Increase k by 1.
                    k++;
                }

                // 7. Return undefined.
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

                var o = Object(this);

                // 2. Let len be ? ToLength(? Get(O, "length")).
                var len = o.length >>> 0;

                // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }

                // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                var thisArg = arguments[1];

                // 5. Let k be 0.
                var k = 0;

                // 6. Repeat, while k < len
                while (k < len) {
                    // a. Let Pk be ! ToString(k).
                    // b. Let kValue be ? Get(O, Pk).
                    // c. Let testResult be ToBoolean(? Call(predicate, T, � kValue, k, O �)).
                    // d. If testResult is true, return k.
                    var kValue = o[k];
                    if (predicate.call(thisArg, kValue, k, o)) {
                        return k;
                    }
                    // e. Increase k by 1.
                    k++;
                }

                // 7. Return -1.
                return -1;
            }
        });
    }

    Math.log10 = Math.log10 = Math.log10 || function (x) {
        return Math.log(x) * Math.LOG10E;
    };

    // https://github.com/wbkd/d3-extended
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

    function rendererSettings() {
        return {
            id_col: 'USUBJID',
            visit_col: 'VISIT',
            visitn_col: 'VISITNUM',
            studyday_col: 'DY',
            measure_col: 'TEST',
            value_col: 'STRESN',
            unit_col: 'STRESU',
            normal_col_low: 'STNRLO',
            normal_col_high: 'STNRHI',
            filters: [],
            baseline: {
                value_col: 'ABLFL', //synced with studyday_col in syncsettings()
                values: ['Y']
            },
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
                phos: 'Phosphate',
                ca: 'Calcium',

                // blood pressure
                diabp: 'Diastolic Blood Pressure',
                sysbp: 'Systolic Blood Pressure',

                // albumin/creatinine
                alb: 'Albumin',
                albcreat: 'Albumin/Creatinine'
            },
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
                    creat: .3,
                    egfr: 25
                },
                stage_2: {
                    creat: .7,
                    egfr: 50
                },
                stage_3: {
                    creat: 1.2,
                    egfr: 75
                }
            }
        };
    }

    function webchartsSettings() {
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
                tooltip: '$x,$y'
            }],
            aspect: 1
        };
    }

    function syncSettings(settings) {
        return settings;
    }

    function controlInputs() {
        return [{
            type: 'dropdown',
            values: ['log', 'linear'],
            label: 'Log/Linear',
            option: 'y.type',
            require: true,
            start: 'linear'
        }];
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

    function listingSettings() {
        return {
            cols: ['ID', 'Measure', 'Visit', 'Value'],
            searchable: false,
            sortable: false,
            pagination: false,
            exportable: false
        };
    }

    var configuration = {
        rendererSettings: rendererSettings,
        webchartsSettings: webchartsSettings,
        settings: Object.assign({}, rendererSettings(), webchartsSettings()),
        syncSettings: syncSettings,
        controlInputs: controlInputs,
        syncControlInputs: syncControlInputs,
        listingSettings: listingSettings
    };

    function onInit() {}

    function onLayout() {
        this.wrap.append('div').append('small').text('Click a line to see details');
    }

    function onPreprocess() {
        this.listing.draw([]);
        this.listing.wrap.style('display', 'none');
    }

    function onDatatransform() {}

    function onDraw() {}

    function drawKdigoStages() {
        var _this = this;

        this.svg.selectAll('.kdigo-stages').remove();

        //this.svg.append('rect')
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

        var kdigo_criteria = Object.keys(this.config.kdigo_criteria).map(function (key) {
            return _this.config.kdigo_criteria[key];
        });

        kdigo_criteria.unshift({
            creat_fchg: 1,
            egfr_creat_fchg: 0,
            color: 'white'
        });

        kdigo_criteria.push({
            creat_fchg: this.x_dom[1],
            egfr_creat_fchg: this.y_dom[1],
            color: this.config.kdigo_criteria.stage_3.color
        });

        console.table(kdigo_criteria);

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

        var kdigoStages = this.svg.insert('g', '.overlay').classed('kdigo-stages', true);

        kdigoStages.selectAll('rect.kdigo-stage').data(kdigo_criteria.reverse()).enter().append('rect').classed('kdigo-stage', true).attr({
            x: function x(d) {
                return 0;
            },
            y: function y(d) {
                return _this.y(d.egfr_creat_fchg);
            },
            width: function width(d) {
                return _this.x(d.creat_fchg);
            },
            height: function height(d) {
                return _this.plot_height - _this.y(d.egfr_creat_fchg);
            },
            fill: function fill(d) {
                return d.color;
            }
        });
    }

    function addPointClick() {
        var points = this.marks.find(function (mark) {
            return mark.type === 'circle';
        }).circles;

        points.on('mouseover', function (d) {
            d3$1.select(this).classed('highlighted', true);
        }).on('mouseout', function (d) {
            d3$1.select(this).classed('highlighted', false);
        }).on('click', function (d) {
            console.log(d);
            points.classed('selected', false);
            d3$1.select(this).classed('selected', true);
        });
    }

    function onResize() {
        drawKdigoStages.call(this);
        addPointClick.call(this);
    }

    function onDestroy() {
        this.listing.destroy();
    }

    var callbacks = {
        onInit: onInit,
        onLayout: onLayout,
        onPreprocess: onPreprocess,
        onDatatransform: onDatatransform,
        onDraw: onDraw,
        onResize: onResize,
        onDestroy: onDestroy
    };

    function layout(element) {
        var container = d3$1.select(element);
        container.append('div').classed('wc-component', true).attr('id', 'wc-controls');
        container.append('div').classed('wc-component', true).attr('id', 'wc-chart');
        container.append('div').classed('wc-component', true).attr('id', 'wc-listing');
    }

    function styles() {
        var styles = ['.wc-chart path.highlighted{', 'stroke-width:3px;', '}', '.wc-chart path.selected{', 'stroke-width:5px;', 'stroke:orange;', '}'];
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = styles.join('\n');
        document.getElementsByTagName('head')[0].appendChild(style);
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
            d.baseline = d[settings.baseline.value_col];
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
                return settings.baseline.values.includes(d.baseline);
            });

            data.forEach(function (d) {
                d.chg = baseline ? d.result - baseline.result : null;
                d.fchg = baseline && baseline.result > 0 ? d.result / baseline.result : null;
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
            d.creat_fn = d.creat_chg >= .3 ? 1 : 0;

            var egfr_cystatc = d.values.find(function (di) {
                return di.key === settings.measure_values.egfr_cystatc;
            });
            var cystatc = d.values.find(function (di) {
                return di.key === settings.measure_values.cystatc;
            });

            d.egfr_cystatc_chg = egfr_cystatc ? egfr_cystatc.values.max_chg : null;
            d.cystatc_fchg = cystatc ? cystatc.values.max_fchg : null;
            d.cystatc_fn = d.cystatc_chg >= .3 ? 1 : 0;
        });

        return participantLevel;
    }

    function init(data) {
        this.data = {
            data: data
        };
        addVariables(this);
        this.data.participants = defineParticipantLevelData(this);
        this.chart.init(this.data.participants);
    }

    function destroy() {}

    function nepExplorer() {
        var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'body';
        var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        // layout and styles
        layout(element);
        styles();

        //Define chart.
        var mergedSettings = Object.assign({}, JSON.parse(JSON.stringify(configuration.settings)), settings);
        var syncedSettings = configuration.syncSettings(mergedSettings);

        // controls
        var syncedControlInputs = configuration.syncControlInputs(configuration.controlInputs(), syncedSettings);
        var controls = webcharts.createControls(document.querySelector(element).querySelector('#wc-controls'), {
            location: 'top',
            inputs: syncedControlInputs
        });

        // chart
        var chart = webcharts.createChart(document.querySelector(element).querySelector('#wc-chart'), syncedSettings, controls);

        for (var callback in callbacks) {
            chart.on(callback.substring(2).toLowerCase(), callbacks[callback]);
        } // listing
        var listingSettings = configuration.listingSettings();
        var listing = webcharts.createTable(document.querySelector(element).querySelector('#wc-listing'), listingSettings);
        listing.wrap.style('display', 'none'); // empty table's popping up briefly
        listing.init([]);

        chart.listing = listing;
        listing.chart = chart;

        var nepExplorer = {
            element: element,
            settings: {
                user: settings,
                merged: mergedSettings,
                synced: syncedSettings,
                controlInputs: syncedControlInputs,
                listing: listingSettings
            },
            chart: chart,
            listing: listing,
            init: init,
            destroy: destroy
        };

        return nepExplorer;
    }

    return nepExplorer;

})));
