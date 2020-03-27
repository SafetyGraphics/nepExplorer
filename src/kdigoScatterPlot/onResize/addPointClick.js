import { select } from 'd3';
import displayParticipant from './displayParticipant';

export default function addPointClick() {
    this.marks
        .find(mark => mark.type === 'circle')
        .circles.on('mouseover', function(d) {
            select(this).classed('wc-highlighted', true);
        })
        .on('mouseout', function(d) {
            select(this).classed('wc-highlighted', false);
        })
        .on('click', d => {
            // Attach participant value.
            this.nepExplorer.participant = d.key;
            displayParticipant.call(this);
        });
}
