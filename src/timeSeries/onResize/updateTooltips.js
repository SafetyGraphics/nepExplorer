export default function updateTooltips() {
    const chart = this;
    const mark = this.marks.find(mark => mark.type === 'circle');
    mark.groups.each(function(d, i) {
        const title = d3.select(this).selectAll('title');
        const datum = d.values.raw[0];
        const variables = [
            { value_col: 'studyday', label: 'Study Day' },
            { value_col: 'visit', label: 'Visit' },
            { value_col: 'visitn', label: 'Visit Number' },
            { value_col: 'measure', label: 'Measure' },
            { value_col: 'result', label: 'Result' }
        ];

        if (
            datum.baseline !== chart.config.baseline_value &&
            !isNaN(datum.baseline_result) &&
            datum.baseline_result !== null
        ) {
            variables.push({ value_col: 'baseline_result', label: 'Baseline Result' });
            variables.push({ value_col: 'chg', label: 'Change from Baseline' });
            variables.push({ value_col: 'pchg', label: 'Percent Change from Baseline' });
        }

        if (datum.xuln !== null) variables.push({ value_col: 'xuln', label: 'Result xULN' });

        const tooltip = variables
            .map(variable => `${variable.label}: ${datum[variable.value_col]}`)
            .join('\n');
        title.text(tooltip);
    });
}
