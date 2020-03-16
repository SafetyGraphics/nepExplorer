import customSettings from './timeSeries/index';

// TODO: add deep merge
export default function timeSeries(chart) {
    const chartSettings = customSettings[chart]();

    const settings = {
        title: chartSettings.title,
        diff: !!chartSettings.diff,
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
