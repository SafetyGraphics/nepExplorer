export default function drawPath() {
    // Define path.
    const line = d3.svg
        .line()
        .x(d => this.x(d.xClamped))
        .y(d => this.y(d.yClamped));

    // Draw path.
    const visitPath = this.hysteresisPlotContainer
        .append('path')
        .attr('class', 'participant-visits')
        .datum(this.nepExplorer.data.participant.visits)
        .attr('d', line)
        .attr('stroke', d =>
            this.colorScale(this.nepExplorer.data.participant[this.config.color_by])
        )
        .attr('stroke-width', '2px')
        .attr('fill', 'none');

    // Animate path.
    const totalLength = visitPath.node().getTotalLength();
    visitPath
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(2000)
        .ease('linear')
        .attr('stroke-dashoffset', 0);

    return visitPath;
}
