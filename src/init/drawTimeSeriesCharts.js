export default function drawTimeSeriesCharts() {
    this.containers.timeSeries.classed('wc-hidden', false);

    for (const name in this.charts) {
        const chart = this.charts[name];

        const chartMeasures = chart.config.measures.map(
            measure => this.settings.synced.measure_values[measure]
        );

        const chartData = d3.merge(
            this.data.participant.values.filter(d => chartMeasures.includes(d.key)).map(d => d.values.data)
        );

        if (chartData.length) {
            if (chart.initialized) chart.draw(chartData);
            else chart.init(chartData);
        } else {
            delete this.charts[chart];
            console.warn(
                `[ ${measures.join(
                    ', '
                )} ] do not exist in the data. The associated chart will not be displayed.`
            );
        }
    }
}
