import { select } from 'd3';
import addClearFunctionality from '../../init/addClearFunctionality';
import displayParticipantDetails from '../../init/displayParticipantDetails';
import drawTimeSeriesCharts from '../../init/drawTimeSeriesCharts';

export default function addPointClick() {
    const chart = this;
    const points = this.marks.find(mark => mark.type === 'circle').circles;

    points
        .on('mouseover', function(d) {
            select(this).classed('wc-highlighted', true);
        })
        .on('mouseout', function(d) {
            select(this).classed('wc-highlighted', false);
        })
        .on('click', function(d) {
            points.classed('wc-selected', false);
            select(this).classed('wc-selected', true);
            chart.nepExplorer.selected = d.key;
            chart.nepExplorer.containers.detailsHeader.text('Participant Details');
            addClearFunctionality.call(chart.nepExplorer);
            displayParticipantDetails.call(chart.nepExplorer, d.key);
            drawTimeSeriesCharts.call(chart.nepExplorer, d.key);
        });
}
