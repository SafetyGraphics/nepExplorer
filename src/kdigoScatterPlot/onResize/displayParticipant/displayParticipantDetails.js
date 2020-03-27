export default function displayParticipantDetails() {
    const nepExplorer = this.nepExplorer;

    nepExplorer.containers.detailsParticipant
        .classed('wc-hidden', false)
        .selectAll('li')
        .remove();

    const lis = nepExplorer.containers.detailsParticipant
        .selectAll('li')
        .data(nepExplorer.settings.synced.details)
        .enter()
        .append('li')
        .classed('wc-details__li', true);

    lis.append('div')
        .classed('wc-details__label', true)
        .text(d => d.label);

    lis.append('div')
        .classed('wc-details__value', true)
        .text(d => nepExplorer.data.participant[d.value_col]);
}
