export default function creat_cystatc() {
    return {
        title: 'Percent Change from Baseline',
        measures: ['creat', 'cystatc'],
        y: {
            column: 'pchg',
            label: '%'
        },
        diff: true
    };
}
