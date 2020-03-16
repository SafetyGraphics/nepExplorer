export default function bp() {
    return {
        title: 'Blood Pressure',
        measures: ['sysbp', 'diabp'],
        y: {
            column: 'result',
            label: 'mmHg'
        }
    };
}
