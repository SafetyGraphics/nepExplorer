export default function clearParticipant() {
    if (
        this.nepExplorer.participant === undefined ||
        this.nepExplorer.data.participant !== undefined
    ) {
        const containers = this.nepExplorer.containers;
        delete this.nepExplorer.data.participant;
        delete this.visitPath;
        delete this.visitPoints;
        containers.detailsHeaderText.text('Click a point to view participant details.');
        containers.detailsClear.classed('wc-hidden', true);
        containers.detailsParticipant
            .classed('wc-hidden', true)
            .selectAll('*')
            .remove();
        containers.timeSeries.classed('wc-hidden', true);
        this.svg
            .selectAll('circle.wc-data-mark')
            .classed('wc-deemphasized', false)
            .classed('wc-selected', false);
        this.containers.hysteresisPlot.selectAll('*').remove();
    }
}
