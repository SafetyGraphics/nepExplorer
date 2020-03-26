export default function displayParticipantDetails() {
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
        .text(d => this.data.participant[d.value_col]);
}
