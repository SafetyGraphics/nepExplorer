export default function bp() {
    return {
        title: 'Blood Pressure',
        measures: ['sysbp', 'diabp'],
        reference_lines: [
            {
                y: 80,
                label: 'Ideal Diastolic BP',
                tooltip: '80 mmHg'
            },
            {
                y: 120,
                label: 'Ideal Systolic BP',
                tooltip: '120 mmHg'
            }
        ],
        y: {
            column: 'result',
            label: 'mmHg',
            domain: [80, 120]
        }
    };
}
