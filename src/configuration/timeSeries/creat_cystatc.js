export default function creat_cystatc() {
    return {
        title: 'Fold Change from Baseline',
        measures: ['creat', 'cystatc'],
        reference_lines: [
            {
                y: 0,
                label: 'Baseline',
                tooltip: chart =>
                    chart.filtered_data
                        .filter(d =>
                            Array.isArray(chart.config.baseline_value)
                                ? chart.config.baseline_value.includes(d.baseline)
                                : chart.config.baseline_value === d.baseline
                        )
                        .map(d => `${d.measure}: ${d.result}`)
                        .join('\n')
            }
        ],
        y: {
            column: 'fchg',
            label: '%'
        },
        diff: true
    };
}
