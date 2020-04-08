export default function drawTimeSeriesCharts() {
    const nepExplorer = this.nepExplorer;

    nepExplorer.containers.timeSeries.classed('wc-hidden', false);

    for (const name in nepExplorer.charts) {
        const chart = nepExplorer.charts[name];

        const chartMeasures = chart.config.measures.map(
            measure => nepExplorer.settings.synced.measure_values[measure]
        );

        const chartData = d3.merge(
            nepExplorer.data.participant.values
                .filter(d => chartMeasures.includes(d.key))
                .map(d => d.values.data)
        );

        if (chartData.length) {
            if (chart.initialized) chart.draw(chartData);
            else {
                chart.nepExplorer = nepExplorer;
                chart.init(chartData);
            }
        } else {
            delete nepExplorer.charts[chart];
            console.warn(
                `[ ${measures.join(
                    ', '
                )} ] do not exist in the data. The associated chart will not be displayed.`
            );
        }
    }
}
