import './util/polyfills';
import './util/moveTo';

import layout from './layout';
import styles from './styles';
import init from './init';
import destroy from './destroy';

import configuration from './configuration/index';

import { createControls, createChart } from 'webcharts';
import kdigoScatterPlotCallbacks from './kdigoScatterPlot/index';
import timeSeriesCallbacks from './timeSeries/index';

export default function nepExplorer(element = 'body', settings = {}) {
    const nepExplorer = {
        element,
        containers: layout(element),
        styles: styles(),
        settings: {
            user: settings
        },
        charts: {},
        init,
        destroy
    };

    // settings
    nepExplorer.settings.merged = Object.assign(
        {},
        configuration.renderer(),
        configuration.kdigoScatterPlot(),
        nepExplorer.settings.user
    );
    nepExplorer.settings.synced = configuration.syncKdigoScatterPlot(nepExplorer.settings.merged);

    // controls
    nepExplorer.settings.controls = {
        inputs: configuration.syncControlInputs(
            configuration.controlInputs(),
            nepExplorer.settings.synced
        )
    };
    nepExplorer.controls = createControls(
        nepExplorer.containers.controls.node(),
        nepExplorer.settings.controls
    );

    // chart
    nepExplorer.kdigoScatterPlot = createChart(
        nepExplorer.containers.kdigoScatterPlot.node(),
        nepExplorer.settings.synced,
        nepExplorer.controls
    );

    for (const callback in kdigoScatterPlotCallbacks)
        nepExplorer.kdigoScatterPlot.on(
            callback.substring(2).toLowerCase(),
            kdigoScatterPlotCallbacks[callback]
        );

    // time series
    Object.keys(configuration.timeSeriesCharts).forEach(chart => {
        const container = nepExplorer.containers.timeSeries
            .append('div')
            .classed(
                `wc-subcomponent wc-subcomponent--chart wc-subcomponent--time-series-chart wc-subcomponent--${chart}`,
                true
            );
        const mergedSettings = Object.assign(
            {},
            configuration.renderer(),
            configuration.timeSeries(chart)
            //nepExplorer.settings.user
        );
        //const syncedSettings = configuration.syncTimeSeries(mergedSettings);

        nepExplorer.containers[`${chart}Container`] = container;
        nepExplorer.containers[`${chart}Header`] = nepExplorer.containers[`${chart}Container`]
            .append('div')
            .classed(`wc-header wc-header--${chart}`, true)
            .text(mergedSettings.title);
        //.text(syncedSettings.title);
        nepExplorer.containers[chart] = container
            .append('div')
            .classed(`wc-chart-container wc-chart-container--${chart}`, true);

        const timeSeries = createChart(
            nepExplorer.containers[chart].node(),
            mergedSettings
            //syncedSettings
        );

        for (const callback in timeSeriesCallbacks)
            timeSeries.on(callback.substring(2).toLowerCase(), timeSeriesCallbacks[callback]);

        nepExplorer.charts[chart] = timeSeries;
    });

    return nepExplorer;
}
