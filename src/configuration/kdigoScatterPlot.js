export default function kdigoScatterPlot() {
    return {
        x: {
            column: 'creat_pchg',
            type: 'log',
            label: 'Creatinine Percent Change',
            format: ',1d'
            //domain: [1, null]
        },
        y: {
            column: 'egfr_creat_pchg',
            type: 'log',
            label: 'eGFR Percent Change',
            format: ',1d'
            //domain: [0, null]
        },
        marks: [
            {
                type: 'circle',
                per: ['key'],
                tooltip: '[key]: $x,$y',
                radius: 3,
                attributes: {}
            }
        ],
        color_by: null,
        legend: {
            location: 'bottom',
            mark: 'circle'
        },
        //resizable: false,
        aspect: 1.25,
        gridlines: 'xy',
        margin: {
            top: 14,
            right: 0,
            left: 50,
            bottom: 0
        }
    };
}
