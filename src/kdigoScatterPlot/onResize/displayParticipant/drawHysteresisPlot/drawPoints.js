export default function drawPoints() {
    const chart = this;

    const visitContainers = this.containers.hysteresisPlot
        .selectAll('g.wc-hysteresis-point-container')
        .data(this.nepExplorer.data.participant.visits)
        .enter()
        .append('g')
        .classed('wc-hysteresis-point-container', true);

    visitContainers.each(function(d) {
        const visitContainer = d3.select(this);
        const x = chart.x(d.xClamped);
        const y = chart.y(d.yClamped);
        const color = chart.colorScale(d[chart.config.color_by]);
        const width = 5;

        if (['<', '>'].includes(d.xIsClamped))
            visitContainer
                .append('polygon')
                .classed('wc-hysteresis-point--clamped wc-hysteresis-point--clamped--x', true)
                .attr({
                    points: [
                        [x, y],
                        [x, y],
                        [x, y]
                    ],
                    fill: color
                })
                .transition()
                .delay(2000)
                .duration(200)
                .attr({
                    points: [
                        [x, y - width],
                        [d.xIsClamped === '<' ? x - width : x + width, y],
                        [x, y + width]
                    ]
                });

        if (['<', '>'].includes(d.yIsClamped))
            visitContainer
                .append('polygon')
                .classed('wc-hysteresis-point--clamped wc-hysteresis-point--clamped--y', true)
                .attr({
                    points: [
                        [x, y],
                        [x, y],
                        [x, y]
                    ],
                    fill: color
                })
                .transition()
                .delay(2000)
                .duration(200)
                .attr({
                    points: [
                        [x - width, y],
                        [x + width, y],
                        [x, d.yIsClamped === '<' ? y + width : y - width]
                    ]
                });

        if (!d.xIsClamped && !d.yIsClamped)
            visitContainer
                .append('circle')
                .classed('wc-hysteresis-point', true)
                .attr({
                    cx: x,
                    cy: y,
                    r: 0,
                    fill: color,
                    stroke: color,
                    'stroke-width': 1
                })
                .transition()
                .delay(2000)
                .duration(200)
                .attr({
                    r: chart.config.marks.find(mark => mark.type === 'circle').radius
                });
    });

    //custom titles for points on mouseover
    visitContainers.append('title').text(d => {
        const studyDay_label = 'Study day: ' + d.studyday + '\n';
        const visitn_label = d.visitn ? 'Visit Number: ' + d.visitn + '\n' : '';
        const visit_label = d.visit ? 'Visit: ' + d.visit + '\n' : '';
        const x_label = this.config.x.label + ': ' + d3.format('0.3f')(d.x) + '\n';
        const y_label = this.config.y.label + ': ' + d3.format('0.3f')(d.y);
        const kdigo_label = d.kdigo ? '\nKDIGO: ' + d.kdigo : '';

        return studyDay_label + visit_label + visitn_label + x_label + y_label + kdigo_label;
    });

    return visitContainers;
}
