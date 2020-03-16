export default function uln() {
    return {
        title: 'Standardized Lab Values',
        measures: ['bun', 'sodium', 'k', 'bicarb', 'cl', 'phos', 'ca'],
        reference_lines: [
            {
                y: 1,
                label: 'ULN',
                tooltip: chart =>
                    d3
                        .nest()
                        .key(d => d.measure)
                        .rollup(data => d3.median(data, d => d.uln))
                        .entries(chart.filtered_data)
                        .map(d => `${d.key}: ${d.values}`)
                        .join('\n')
            }
        ],
        y: {
            column: 'xuln',
            label: '[xULN]',
            domain: [0, 3]
        }
    };
}
