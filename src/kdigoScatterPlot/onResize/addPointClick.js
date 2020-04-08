import displayParticipant from './displayParticipant';

export default function addPointClick() {
    this.marks
        .find(mark => mark.type === 'circle')
        .groups.selectAll('circle')
        .on('click', d => {
            // Attach participant value.
            this.nepExplorer.participant = d.key;
            displayParticipant.call(this);
        });
}
