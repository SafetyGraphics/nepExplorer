export default function egfr() {
    return {
        title: 'Change from Baseline',
        measures: ['egfr_creat', 'egfr_cystatc'],
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
            column: 'chg',
            label: 'mL/min/1.73m²'
        },
        diff: true
    };
}
