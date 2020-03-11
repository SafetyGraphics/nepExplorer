export default function settings() {
    return {
        x: {
            column: 'studyday',
            type: 'linear',
            label: 'Study Day',
            format: ',1d',
        },
        y: {
            column: 'pchg',
            type: 'linear',
            label: 'Percent Change from Baseline (%)',
            format: '.1f',
        },
        marks: [
            {
                type: 'line',
                per: ['measure'],
                tooltip: '$x,$y',
            },
            {
                type: 'circle',
                per: ['measure', 'studyday'],
                tooltip: '$x,$y',
            }
        ],
        color_by: 'measure',
        legend: {
            label: '',
        },
        gridlines: 'xy',
        resizable: false,
        aspect: 2,
    };
}
