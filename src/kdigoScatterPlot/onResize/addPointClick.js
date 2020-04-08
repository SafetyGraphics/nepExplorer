import { select } from 'd3';
import displayParticipant from './displayParticipant';

export default function addPointClick() {
    this.marks
        .find(mark => mark.type === 'circle')
        .groups.selectAll('circle')
        .on('mouseover', function(d) {
            d3.select(this.parentNode)
                .select('.wc-data-mark')
                .classed('wc-highlighted', true);
        })
        .on('mouseout', function(d) {
            d3.select(this.parentNode)
                .select('.wc-data-mark')
                .classed('wc-highlighted', false);
        })
        .on('click', d => {
            // Attach participant value.
            this.nepExplorer.participant = d.key;
            displayParticipant.call(this);
        });
}
