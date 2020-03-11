import { select } from 'd3';

export default function addPointClick() {
    const chart = this;
    const points = this.marks.find(mark => mark.type === 'circle').circles;

    points
        .on('mouseover', function(d) {
            select(this).classed('highlighted', true);
        })
        .on('mouseout', function(d) {
            select(this).classed('highlighted', false);
        })
        .on('click', function(d) {
            points.classed('selected', false);
            select(this).classed('selected', true);

            const measures = d3.merge(d.values.raw[0].values
                .filter(d => [chart.config.measure_values.creat, chart.config.measure_values.cystatc].includes(d.key))
                .map(d => d.values.data));
            chart.chart2.draw(measures);

            const chart3measures = d3.merge(d.values.raw[0].values
                .filter(d => (
                    [
                        chart.config.measure_values.bun,
                        chart.config.measure_values.sodium,
                        chart.config.measure_values.k,
                        chart.config.measure_values.bicarb,
                        chart.config.measure_values.cl,
                        chart.config.measure_values.phos,
                        chart.config.measure_values.ca,
                    ]
                        .includes(d.key)
                ))
                .map(d => d.values.data));
            chart.chart3.draw(chart3measures);
        });
}
