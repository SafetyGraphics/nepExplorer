export default function drawVisitPath() {
    const chart = this;
    const config = chart.config;

    const data = this.nepExplorer.data.participant;
    const x_data = data.values.find(d => d.key === this.config.x.measure).values.data;
    const x_studyDays = x_data.map(d => d.studyday);
    const y_data = data.values.find(d => d.key === this.config.y.measure).values.data;
    const y_studyDays = y_data.map(d => d.studyday);
    const studyDays = x_studyDays.filter(studyDay => y_studyDays.includes(studyDay));

    // get coordinates by studyDay
    const byStudyDay = studyDays
        .map(studyDay => {
            const visitObj = {};
            visitObj.studyday = +studyDay;
            visitObj.visit = config.visit_col
                ? x_data.find(d => d.studyday === studyDay)[config.visit_col]
                : null;
            visitObj.visitn = config.visitn_col
                ? x_data.find(d => d.studyday === studyDay)[config.visitn_col]
                : null;
            if (config.color_by)
                visitObj[config.color_by] = x_data[0][config.color_by];

            // Get x coordinate.
            visitObj.xMatch = x_data.find(d => d.studyday === studyDay);
            visitObj.x = visitObj.xMatch[config.x.result];
            visitObj.xClamped = Math.max(visitObj.x, this.config.x.domain[0]);
            visitObj.xIsClamped = visitObj.x !== visitObj.xClamped;

            // Get y coordinate.
            visitObj.yMatch = y_data.find(d => d.studyday === studyDay);
            visitObj.y = visitObj.yMatch[config.y.result];
            visitObj.yClamped = Math.max(visitObj.y, this.config.y.domain[0]);
            visitObj.yIsClamped = visitObj.y !== visitObj.yClamped;

            // Get KDIGO.
            const kdigo = this.config.criteria
                .slice()
                .sort((a, b) => b.x - a.x)
                .find(criterion => {
                    return criterion.x <= visitObj.x || criterion.y <= visitObj.y;
                }).label;
            visitObj.kdigo = kdigo
                ? kdigo.replace(/stage_(\d)/, 'Stage $1 AKI').replace('no_aki', 'No AKI')
                : '???';

            return visitObj;
        })
        .sort((a,b) => a.studyday - b.studyday)
        //.filter(d => d.x >= this.config.x.domain[0] && d.y >= this.config.y.domain[0]);

    //draw the path
    chart.svg.selectAll('.visit-path').remove();
    chart.visitPath = chart.svg.append('g').attr('class', 'visit-path');
    var myLine = d3.svg
        .line()
        .x(d => chart.x(d.xClamped))
        .y(d => chart.y(d.yClamped));

    chart.visitPath.moveToFront();

    var path = chart.visitPath
        .append('path')
        .attr('class', 'participant-visits')
        .datum(byStudyDay)
        .attr('d', myLine)
        .attr('stroke', d => chart.colorScale(data[config.color_by]))
        .attr('stroke-width', '2px')
        .attr('fill', 'none');

    //Little trick for animating line drawing
    var totalLength = path.node().getTotalLength();
    path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(2000)
        .ease('linear')
        .attr('stroke-dashoffset', 0);

    //draw visit points
    var visitPoints = chart.visitPath
        .selectAll('g.visit-point')
        .data(byStudyDay)
        .enter()
        .append('g')
        .attr('class', 'visit-point');

    visitPoints
        .append('circle')
        .attr('class', 'participant-visits')
        .attr('r', 0)
        .attr('stroke', d => chart.colorScale(d[config.color_by]))
        .attr('stroke-width', 1)
        .attr('cx', d => chart.x(d.xClamped))
        .attr('cy', d => chart.y(d.yClamped))
        .attr('fill', d => chart.colorScale(d[config.color_by]))
        //.attr('fill-opacity', d => d.xIsClamped || d.yIsClamped)
        .transition()
        .delay(2000)
        .duration(200)
        .attr('r', 4);

    //custom titles for points on mouseover
    visitPoints.append('title').text(function(d) {
        var xvar = config.x.column;
        var yvar = config.y.column;

        const studyday_label = 'Study day: ' + d.studyday + '\n',
            visitn_label = d.visitn ? 'Visit Number: ' + d.visitn + '\n' : '',
            visit_label = d.visit ? 'Visit: ' + d.visit + '\n' : '',
            x_label = config.x.label + ': ' + d3.format('0.3f')(d.x) + '\n',
            y_label = config.y.label + ': ' + d3.format('0.3f')(d.y),
            kdigo_label = d.kdigo ? '\nR Ratio: ' + d3.format('0.2f')(d.kdigo) : '';

        return studyday_label + visit_label + visitn_label + x_label + y_label + kdigo_label;
    });
}
