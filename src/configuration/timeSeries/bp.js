export default function albcreat() {
    return {
        measures: ['sysbp', 'diabp'],
        y: {
            column: 'result',
            label: 'Blood Pressure (mmHg)'
        }
    };
}
