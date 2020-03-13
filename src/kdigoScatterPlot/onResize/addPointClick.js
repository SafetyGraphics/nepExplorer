import { select } from 'd3';
import drawTimeSeries from '../../init/drawTimeSeries';

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
            drawTimeSeries.call(chart.nepExplorer, d.key);
        });
}
