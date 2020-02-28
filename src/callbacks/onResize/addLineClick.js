import { select } from 'd3';
import configuration from '../../configuration';

export default function addLineClick() {
    var chart = this;
    var paths = this.marks[0].paths;

    paths
        .on('mouseover', function(d) {
            select(this).classed('highlighted', true);
        })
        .on('mouseout', function(d) {
            select(this).classed('highlighted', false);
        })
        .on('click', function(d) {
            console.log(d);
            chart.listing.wrap.style('display', null);
            paths.classed('selected', false);
            select(this).classed('selected', true);

            var tableData = d.values.map(function(d) {
                return {
                    ID: d.values.raw[0][chart.config.id_col],
                    Measure: d.values.raw[0][chart.config.measure_col],
                    Visit: d.key,
                    Value: d.values.y
                };
            });
            chart.listing.draw(tableData);
        });
}
