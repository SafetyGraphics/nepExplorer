export default function addClearFunctionality() {
    const containers = this.nepExplorer.containers;

    containers.detailsClear.classed('wc-hidden', false).on('click', () => {
        containers.detailsHeaderText.text('Click a point to view participant details.');
        containers.detailsClear.classed('wc-hidden', true);
        containers.detailsParticipant
            .classed('wc-hidden', true)
            .selectAll('*')
            .remove();
        containers.timeSeries.classed('wc-hidden', true);
        this.marks.find(mark => mark.type === 'circle').circles.classed('wc-selected', false);
        this.hysteresisPlotContainer.selectAll('*').remove();
    });
}
