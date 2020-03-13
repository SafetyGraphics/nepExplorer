import { select } from 'd3';
import addClearFunctionality from './addPointClick/addClearFunctionality';
import displayParticipantDetails from './addPointClick/displayParticipantDetails';
import drawTimeSeriesCharts from './addPointClick/drawTimeSeriesCharts';

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
            chart.nepExplorer.containers.detailsHeader.text('Participant Details');
            addClearFunctionality.call(chart.nepExplorer);
            displayParticipantDetails.call(chart.nepExplorer, d.key);
            drawTimeSeriesCharts.call(chart.nepExplorer, d.key);
        });
}
