export default function albcreat() {
    return {
        diff: true,
        measures: ['egfr_creat', 'egfr_cystatc'],
        y: {
            column: 'chg',
            label: 'Change from Baseline'
        }
    };
}
