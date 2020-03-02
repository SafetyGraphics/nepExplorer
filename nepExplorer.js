(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('d3'), require('webcharts')) :
    typeof define === 'function' && define.amd ? define(['d3', 'webcharts'], factory) :
    (global = global || self, global.nepExplorer = factory(global.d3, global.webCharts));
}(this, (function (d3, webcharts) { 'use strict';

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
    d3.selection.prototype.moveToFront = function () {
        return this.each(function () {
            this.parentNode.appendChild(this);
        });
    };

    d3.selection.prototype.moveToBack = function () {
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
            measure_col: 'TEST',
            value_col: 'STRESN',
            filters: [] //updated in sync settings
        };
    }

    function webchartsSettings() {
        return {
            x: {
                column: null,
                type: 'ordinal',
                label: 'Visit'
            },
            y: {
                column: null,
                type: 'linear',
                label: 'Value',
                behavior: 'flex',
                format: '0.2f'
            },
            marks: [{
                type: 'line',
                per: null,
                attributes: { 'stroke-width': 0.5, stroke: '#999' }
            }],
            gridlines: 'xy',
            aspect: 3,
            color_by: null,
            max_width: 900
        };
    }

    function syncSettings(settings) {
        // webcharts settings
        settings.x.column = settings.visitn_col;
        settings.y.column = settings.value_col;
        settings.marks[0].per = [settings.id_col];
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
        // use the measure column as a filter
        controlInputs.push({
            type: 'subsetter',
            value_col: settings.measure_col,
            label: 'Measure',
            required: true,
            start: 'Calcium'
        });

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
        chart.listing.draw([]);
        chart.listing.wrap.style('display', 'none');
    }

    function onDatatransform() {}

    function onDraw() {}

    function addLineClick() {
        var chart = this;
        var paths = this.marks[0].paths;

        paths.on('mouseover', function (d) {
            d3.select(this).classed('highlighted', true);
        }).on('mouseout', function (d) {
            d3.select(this).classed('highlighted', false);
        }).on('click', function (d) {
            console.log(d);
            chart.listing.wrap.style('display', null);
            paths.classed('selected', false);
            d3.select(this).classed('selected', true);

            var tableData = d.values.map(function (d) {
                return {
                    ID: d.values.raw[0][chart.config.id_col],
                    Measure: d.values.raw[0][chart.config.measure_col],
                    Visit: d.key,
                    Value: d.values.y
                };
            });
            chart.listing.draw(tableData);
        });
    }

    function onResize() {
        addLineClick.call(this);
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
        var container = d3.select(element);
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

    function nepExplorer() {
        var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'body';
        var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        //layout and styles
        layout(element);
        styles();

        //Define chart.
        var mergedSettings = Object.assign({}, JSON.parse(JSON.stringify(configuration.settings)), settings);
        var syncedSettings = configuration.syncSettings(mergedSettings);
        var syncedControlInputs = configuration.syncControlInputs(configuration.controlInputs(), syncedSettings);
        var controls = webcharts.createControls(document.querySelector(element).querySelector('#wc-controls'), {
            location: 'top',
            inputs: syncedControlInputs
        });
        var chart = webcharts.createChart(document.querySelector(element).querySelector('#wc-chart'), syncedSettings, controls);

        //Define chart callbacks.
        for (var callback in callbacks) {
            chart.on(callback.substring(2).toLowerCase(), callbacks[callback]);
        } //listing
        var listing = webcharts.createTable(document.querySelector(element).querySelector('#wc-listing'), configuration.listingSettings());
        listing.wrap.style('display', 'none'); // empty table's popping up briefly
        listing.init([]);
        chart.listing = listing;
        listing.chart = chart;

        return chart;
    }

    return nepExplorer;

})));
