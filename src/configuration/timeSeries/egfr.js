export default function albcreat() {
    return {
        measures: ['egfr_creat', 'egfr_cystatc'],
        y: {
            column: 'chg',
            label: 'Change from Baseline'
        }
    };
}
