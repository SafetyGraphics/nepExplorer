export default function updateTooltips() {
    const chart = this;
    const mark = this.marks.find(mark => mark.type === 'circle');
    mark.groups.each(function(d, i) {
        const title = d3.select(this).selectAll('title');

        const participant = d.values.raw[0];

        const x = participant.values.find(value => value.key === chart.config.x.measure).values;
        const xVisitWindow = x.visitWindows.find(
            visitWindow => visitWindow[chart.config.x.result] === d.values.x
        );
        const xVis1 = xVisitWindow.vis1;
        const xVis2 = xVisitWindow.vis2;

        const y = participant.values.find(value => value.key === chart.config.y.measure).values;
        const yVisitWindow = y.visitWindows.find(
            visitWindow => visitWindow[chart.config.y.result] === d.values.y
        );
        const yVis1 = yVisitWindow.vis1;
        const yVis2 = yVisitWindow.vis2;

        title.text(
            [
                `Participant ID: ${d.key}`,
                `KDIGO: ${participant.kdigo}`,
                `${chart.config.x.label}: ${d.values.x} (${xVis1.result} > ${xVis2.result})`,
                `${chart.config.y.label}: ${d.values.y} (${yVis1.result} > ${yVis2.result})`,
                `${chart.config.x.measure} visit window: ${xVis1.studyday} > ${xVis2.studyday} (${xVis1.visit} > ${xVis2.visit})`,
                `${chart.config.y.measure} visit window: ${yVis1.studyday} > ${yVis2.studyday} (${yVis1.visit} > ${yVis2.visit})`
            ].join('\n')
        );
    });
}
