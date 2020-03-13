export default function displayParticipantDetails(id) {
    const participant = this.data.participants.find(d => d.key === id);

    this.containers.detailsParticipant
        .classed('wc-hidden', false)
        .selectAll('li')
        .remove();

    const lis = this.containers.detailsParticipant
        .selectAll('li')
        .data(this.settings.synced.details)
        .enter()
        .append('li')
        .classed('wc-details__li', true);

    lis.append('div')
        .classed('wc-details__label', true)
        .text(d => d.label);

    lis.append('div')
        .classed('wc-details__value', true)
        .text(d => participant[d.value_col]);
}
