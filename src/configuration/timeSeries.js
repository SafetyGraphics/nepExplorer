import customSettings from './timeSeries/index';

export default function timeSeries(chart) {
    const chartSettings = customSettings[chart]();

    const settings = {
        measures: chartSettings.measures,
        x: {
            column: 'studyday',
            type: 'linear',
            label: 'Study Day',
            format: ',1d'
        },
        y: {
            ...chartSettings.y,
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
