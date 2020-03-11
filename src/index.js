import './util/polyfills';
import './util/moveTo';
import configuration from './configuration/index';
import { createChart, createControls, createTable } from 'webcharts';
import callbacks from './callbacks/index';

import chart2settings from './resultsOverTime/settings';

// layout and styles
import layout from './layout';
import styles from './styles';
import init from './init';
import destroy from './destroy';

export default function nepExplorer(element = 'body', settings = {}) {
    // layout and styles
    const containers = layout(element);
    styles();

    //Define chart.
    const mergedSettings = Object.assign(
        {},
        JSON.parse(JSON.stringify(configuration.settings)),
        settings
    );
    const syncedSettings = configuration.syncSettings(mergedSettings);

    // controls
    const syncedControlInputs = configuration.syncControlInputs(
        configuration.controlInputs(),
        syncedSettings
    );
    const controls = createControls(document.querySelector(element).querySelector('#wc-controls'), {
        location: 'top',
        inputs: syncedControlInputs
    });

    // chart
    const chart = createChart(containers.chart1.node(), syncedSettings, controls);

    for (const callback in callbacks)
        chart.on(callback.substring(2).toLowerCase(), callbacks[callback]);

    const chart2 = createChart(containers.chart2.node(), chart2settings());

    chart2.on('layout', function() {
        this.participantLabel = this.wrap.insert('span', ':first-child');
    });

    chart2.on('draw', function() {
        this.participantLabel.text(d => `Participant ID: ${this.raw_data[0].id}`);
    });

    chart.chart2 = chart2;

    const chart3settings = chart2settings();
    chart3settings.y.column = 'xuln';
    chart3settings.y.label = 'Standardized Result [xULN]';
    const chart3 = createChart(containers.chart3.node(), chart3settings);

    chart3.on('layout', function() {
        this.participantLabel = this.wrap.insert('span', ':first-child');
    });

    chart3.on('draw', function() {
        this.participantLabel.text(d => `Participant ID: ${this.raw_data[0].id}`);
    });

    chart.chart3 = chart3;

    const nepExplorer = {
        element,
        settings: {
            user: settings,
            merged: mergedSettings,
            synced: syncedSettings,
            controlInputs: syncedControlInputs
        },
        chart,
        chart2,
        chart3,
        init,
        destroy
    };

    return nepExplorer;
}
