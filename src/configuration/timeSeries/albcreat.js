export default function albcreat() {
    return {
        title: 'Albumin/Creatinine Ratio',
        measures: ['albcreat'],
        reference_lines: [
            {
                y: 0,
                label: 'A1 Albuminuria',
                tooltip: '0-<30 mg/g'
            },
            {
                y: 30,
                label: 'A2 Albuminuria',
                tooltip: '30-<300 mg/g'
            },
            {
                y: 300,
                label: 'A3 Albuminuria',
                tooltip: '>=300 mg/g'
            }
        ],
        y: {
            column: 'result',
            label: 'mg/g',
            domain: [0, 30]
        },
        margin: {
            top: 14
        }
    };
}
