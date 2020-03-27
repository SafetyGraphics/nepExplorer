export default function drawPoints() {
    const visitPoints = this.hysteresisPlotContainer
        .selectAll('g.visit-point')
        .data(this.nepExplorer.data.participant.visits)
        .enter()
        .append('g')
        .attr('class', 'visit-point');

    visitPoints
        .append('circle')
        .attr('class', 'participant-visits')
        .attr('r', 0)
        .attr('stroke', d => this.colorScale(d[this.config.color_by]))
        .attr('stroke-width', 1)
        .attr('cx', d => this.x(d.xClamped))
        .attr('cy', d => this.y(d.yClamped))
        .attr('fill', d => this.colorScale(d[this.config.color_by]))
        .attr('fill-opacity', d => (d.xIsClamped || d.yIsClamped ? 0.25 : 0.75))
        .transition()
        .delay(2000)
        .duration(200)
        .attr('r', 4);

    //custom titles for points on mouseover
    visitPoints.append('title').text(d => {
        const studyDay_label = 'Study day: ' + d.studyDay + '\n';
        const visitn_label = d.visitn ? 'Visit Number: ' + d.visitn + '\n' : '';
        const visit_label = d.visit ? 'Visit: ' + d.visit + '\n' : '';
        const x_label = this.config.x.label + ': ' + d3.format('0.3f')(d.x) + '\n';
        const y_label = this.config.y.label + ': ' + d3.format('0.3f')(d.y);
        const kdigo_label = d.kdigo ? '\nKDIGO: ' + d.kdigo : '';

        return studyDay_label + visit_label + visitn_label + x_label + y_label + kdigo_label;
    });

    return visitPoints;
}
