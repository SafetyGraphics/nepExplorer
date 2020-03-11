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

    Math.log10 = Math.log10 =
        Math.log10 ||
        function(x) {
            return Math.log(x) * Math.LOG10E;
        };

    // https://github.com/wbkd/d3-extended
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
                phos: 'Phosphorus',
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
            marks: [
                {
                    type: 'circle',
                    per: ['key'],
                    tooltip: '[key]: $x,$y'
                }
            ],
            resizable: false,
            aspect: 2
        };
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
        rendererSettings: rendererSettings,
        webchartsSettings: webchartsSettings,
        settings: Object.assign({}, rendererSettings(), webchartsSettings()),
        syncSettings: syncSettings,
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
        var rects = g
            .selectAll('rect')
            .data([
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
            ])
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
                'clip-path': 'url(#' + this.id + ')'
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
                d3$1.select(this).classed('highlighted', true);
            })
            .on('mouseout', function(d) {
                d3$1.select(this).classed('highlighted', false);
            })
            .on('click', function(d) {
                points.classed('selected', false);
                d3$1.select(this).classed('selected', true);

                var measures = d3.merge(
                    d.values.raw[0].values
                        .filter(function(d) {
                            return [
                                chart.config.measure_values.creat,
                                chart.config.measure_values.cystatc
                            ].includes(d.key);
                        })
                        .map(function(d) {
                            return d.values.data;
                        })
                );
                chart.chart2.draw(measures);

                var chart3measures = d3.merge(
                    d.values.raw[0].values
                        .filter(function(d) {
                            return [
                                chart.config.measure_values.bun,
                                chart.config.measure_values.sodium,
                                chart.config.measure_values.k,
                                chart.config.measure_values.bicarb,
                                chart.config.measure_values.cl,
                                chart.config.measure_values.phos,
                                chart.config.measure_values.ca
                            ].includes(d.key);
                        })
                        .map(function(d) {
                            return d.values.data;
                        })
                );
                chart.chart3.draw(chart3measures);
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

    function settings() {
        return {
            x: {
                column: 'studyday',
                type: 'linear',
                label: 'Study Day',
                format: ',1d'
            },
            y: {
                column: 'pchg',
                type: 'linear',
                label: 'Percent Change from Baseline (%)',
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
            legend: {
                label: ''
            },
            gridlines: 'xy',
            resizable: false,
            aspect: 2
        };
    }

    function layout(element) {
        var containers = {
            main: d3$1
                .select(element)
                .append('div')
                .classed('wc-framework', true)
        };
        containers.controls = containers.main
            .append('div')
            .classed('wc-component wc-component--controls', true);
        containers.chart1 = containers.main
            .append('div')
            .classed('wc-component wc-component--chart wc-component--chart-1', true);
        containers.chart1
            .append('span')
            .classed('wc-header', true)
            .text('KDIGO Stages');
        containers.chart2 = containers.main
            .append('div')
            .classed('wc-component wc-component--chart wc-component--chart-2', true);
        containers.chart2
            .append('span')
            .classed('wc-header', true)
            .text('Percent Change from Baseline by Study Day');
        containers.chart3 = containers.main
            .append('div')
            .classed('wc-component wc-component--chart wc-component--chart-3', true);
        containers.chart3
            .append('span')
            .classed('wc-header', true)
            .text('Standardized Result [xULN] by Study Day');

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
            '.wc-header {',
            '    font-size: 20px;',
            '    font-weight: bold;',
            '}',
            '.wc-row {',
            '    width: 100%;',
            '    display: inline-block;',
            '}',
            '.wc-component--chart {',
            '    display: inline-block;',
            '}',
            '.wc-framework .wc-component--chart {',
            '    width: 32%;',
            '}',
            '.wc-framework .wc-data-mark {',
            '    cursor: pointer;',
            '}',
            '.wc-framework .wc-component--chart-1 {',
            '    float: left;',
            '}',
            '.wc-framework .wc-component--chart-2 {',
            '    margin: 0 2%;',
            '}',
            '.wc-framework .wc-component--chart-3 {',
            '    float: right;',
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
            d.baseline = d[settings.baseline.value_col];
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
                    return settings.baseline.values.includes(d.baseline);
                });

                data.forEach(function(d) {
                    d.chg = baseline ? d.result - baseline.result : null;
                    d.fchg = baseline && baseline.result > 0 ? d.result / baseline.result : null;
                    d.pchg =
                        baseline && baseline.result > 0
                            ? (d.result / baseline.result - 1) * 100
                            : null;
                    d.xuln = d.result > 0 && d.uln > 0 ? d.result / d.uln : null;
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
            .entries(data);

        participantLevel.forEach(function(d) {
            var egfr_creat = d.values.find(function(di) {
                return di.key === settings.measure_values.egfr_creat;
            });
            var creat = d.values.find(function(di) {
                return di.key === settings.measure_values.creat;
            });

            d.egfr_creat_chg = egfr_creat ? (egfr_creat.values.max_fchg - 1) * 100 : null;
            d.creat_fchg = creat ? creat.values.max_fchg : null;
            d.creat_fn = d.creat_chg >= 0.3 ? 1 : 0;

            var egfr_cystatc = d.values.find(function(di) {
                return di.key === settings.measure_values.egfr_cystatc;
            });
            var cystatc = d.values.find(function(di) {
                return di.key === settings.measure_values.cystatc;
            });

            d.egfr_cystatc_chg = egfr_cystatc ? egfr_cystatc.values.max_chg : null;
            d.cystatc_fchg = cystatc ? cystatc.values.max_fchg : null;
            d.cystatc_fn = d.cystatc_chg >= 0.3 ? 1 : 0;
        });

        return participantLevel;
    }

    function init(data) {
        var _this = this;

        this.data = {
            data: data
        };
        addVariables(this);
        this.data.participants = defineParticipantLevelData(this);
        this.chart.init(this.data.participants);
        var participant = this.data.participants.find(function(d) {
            return d.key === '02-008';
        });
        var chart2measures = d3.merge(
            participant.values
                .filter(function(d) {
                    return [
                        _this.settings.synced.measure_values.creat,
                        _this.settings.synced.measure_values.cystatc
                    ].includes(d.key);
                })
                .map(function(d) {
                    return d.values.data;
                })
        );
        this.chart2.init(chart2measures);
        var chart3measures = d3.merge(
            participant.values
                .filter(function(d) {
                    return [
                        _this.settings.synced.measure_values.bun,
                        _this.settings.synced.measure_values.sodium,
                        _this.settings.synced.measure_values.k,
                        _this.settings.synced.measure_values.bicarb,
                        _this.settings.synced.measure_values.cl,
                        _this.settings.synced.measure_values.phos,
                        _this.settings.synced.measure_values.ca
                    ].includes(d.key);
                })
                .map(function(d) {
                    return d.values.data;
                })
        );
        this.chart3.init(chart3measures);
    }

    function destroy() {}

    function nepExplorer() {
        var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'body';
        var settings$1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        // layout and styles
        var containers = layout(element);
        styles();

        //Define chart.
        var mergedSettings = Object.assign(
            {},
            JSON.parse(JSON.stringify(configuration.settings)),
            settings$1
        );
        var syncedSettings = configuration.syncSettings(mergedSettings);

        // controls
        var syncedControlInputs = configuration.syncControlInputs(
            configuration.controlInputs(),
            syncedSettings
        );
        var controls = webcharts.createControls(
            document.querySelector(element).querySelector('#wc-controls'),
            {
                location: 'top',
                inputs: syncedControlInputs
            }
        );

        // chart
        var chart = webcharts.createChart(containers.chart1.node(), syncedSettings, controls);

        for (var callback in callbacks) {
            chart.on(callback.substring(2).toLowerCase(), callbacks[callback]);
        }
        var chart2 = webcharts.createChart(containers.chart2.node(), settings());

        chart2.on('layout', function() {
            this.participantLabel = this.wrap.insert('span', ':first-child');
        });

        chart2.on('draw', function() {
            var _this = this;

            this.participantLabel.text(function(d) {
                return 'Participant ID: ' + _this.raw_data[0].id;
            });
        });

        chart.chart2 = chart2;

        var chart3settings = settings();
        chart3settings.y.column = 'xuln';
        chart3settings.y.label = 'Standardized Result [xULN]';
        var chart3 = webcharts.createChart(containers.chart3.node(), chart3settings);

        chart3.on('layout', function() {
            this.participantLabel = this.wrap.insert('span', ':first-child');
        });

        chart3.on('draw', function() {
            var _this2 = this;

            this.participantLabel.text(function(d) {
                return 'Participant ID: ' + _this2.raw_data[0].id;
            });
        });

        chart.chart3 = chart3;

        var nepExplorer = {
            element: element,
            settings: {
                user: settings$1,
                merged: mergedSettings,
                synced: syncedSettings,
                controlInputs: syncedControlInputs
            },
            chart: chart,
            chart2: chart2,
            chart3: chart3,
            init: init,
            destroy: destroy
        };

        return nepExplorer;
    }

    return nepExplorer;
});
