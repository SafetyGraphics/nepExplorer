export default function addClearFunctionality() {
    this.containers.detailsClear.classed('wc-hidden', false).on('click', () => {
        this.containers.detailsHeader.text('Click a point to view participant details.');
        this.containers.detailsClear.classed('wc-hidden', true);
        this.containers.detailsParticipant
            .classed('wc-hidden', true)
            .selectAll('*')
            .remove();
        this.containers.timeSeries.classed('wc-hidden', true);
        this.kdigoScatterPlot.marks
            .find(mark => mark.type === 'circle')
            .circles.classed('wc-selected', false);
    });
}
