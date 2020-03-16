export default function egfr() {
    return {
        title: 'Change from Baseline',
        measures: ['egfr_creat', 'egfr_cystatc'],
        y: {
            column: 'chg',
            label: 'mL/min/1.73m²'
        },
        diff: true
    };
}
