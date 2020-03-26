import { select } from 'd3';
import drawVisitPath from './addPointClick/drawVisitPath';
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
            // Get participant data.
            chart.nepExplorer.participant = d.key;
            chart.nepExplorer.data.participant = chart.nepExplorer.data.participants
                .find(d => d.key === chart.nepExplorer.participant);

            // Update points.
            points.classed('wc-selected', false);
            select(this).classed('wc-selected', true);
            drawVisitPath.call(chart);

            // Update participant details section
            chart.nepExplorer.containers.detailsHeader.text('Participant Details');
            addClearFunctionality.call(chart.nepExplorer);
            displayParticipantDetails.call(chart.nepExplorer);
            drawTimeSeriesCharts.call(chart.nepExplorer);
        });
}
