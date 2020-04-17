import merge from '../util/merge';
import timeSeriesSettings from './timeSeries/index';

export default function timeSeries(chart) {
    const customSettings = timeSeriesSettings[chart]();
    const customKeys = Object.keys(customSettings);

    const commonSettings = {
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
    const commonKeys = Object.keys(commonSettings);

    const settings = merge(commonSettings, customSettings);
    settings.chart = chart;

    return settings;
}
