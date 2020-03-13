export default function kdigoScatterPlot() {
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
        aspect: 2,
        gridlines: 'xy'
    };
}
