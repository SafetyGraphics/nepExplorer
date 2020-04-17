export default function defineVisitLevelData() {
    const x_data = this.nepExplorer.data.participant.values.find(
        d => d.key === this.config.x.measure
    ).values.data;
    const x_studydays = x_data.map(d => d.studyday);

    const y_data = this.nepExplorer.data.participant.values.find(
        d => d.key === this.config.y.measure
    ).values.data;
    const y_studydays = y_data.map(d => d.studyday);

    const studydays = x_studydays.filter(studyday => y_studydays.includes(studyday));

    // Get coordinates by study day.
    const visits = studydays
        .map(studyday => {
            const visitObj = {
                studyday
            };

            // Get visit value.
            visitObj.visit = this.config.visit_col
                ? x_data.find(d => d.studyday === studyday)[this.config.visit_col]
                : null;
            visitObj.visitn = this.config.visitn_col
                ? x_data.find(d => d.studyday === studyday)[this.config.visitn_col]
                : null;

            // Get x coordinate.
            const xMatch = x_data.find(d => d.studyday === studyday);
            visitObj.x = xMatch[this.config.x.result];
            if (visitObj.x < this.x_dom[0]) {
                visitObj.xClamped = this.x_dom[0];
                visitObj.xIsClamped = '<';
            } else if (visitObj.x > this.x_dom[1]) {
                visitObj.xClamped = this.x_dom[1];
                visitObj.xIsClamped = '>';
            } else {
                visitObj.xClamped = visitObj.x;
                visitObj.xIsClamped = '';
            }

            // Get y coordinate.
            const yMatch = y_data.find(d => d.studyday === studyday);
            visitObj.y = yMatch[this.config.y.result];
            if (visitObj.y < this.y_dom[0]) {
                visitObj.yClamped = this.y_dom[0];
                visitObj.yIsClamped = '<';
            } else if (visitObj.y > this.y_dom[1]) {
                visitObj.yClamped = this.y_dom[1];
                visitObj.yIsClamped = '>';
            } else {
                visitObj.yClamped = visitObj.y;
                visitObj.yIsClamped = '';
            }

            // Get color value.
            if (this.config.color_by)
                visitObj[this.config.color_by] = x_data[0][this.config.color_by];

            // Get KDIGO stage.
            const kdigo = this.config.criteria
                .slice()
                .sort((a, b) => b.x - a.x)
                .find(criterion => {
                    return criterion.x <= visitObj.x || criterion.y <= visitObj.y;
                });
            visitObj.kdigo = kdigo
                ? kdigo.label.replace(/stage_(\d)/, 'Stage $1 AKI').replace('no_aki', 'No AKI')
                : '???';

            // for voronoi diagram
            visitObj.values = {
                x: visitObj.x,
                y: visitObj.y
            };
            visitObj.key = `study-day-${studyday}`;

            return visitObj;
        })
        .sort((a, b) => a.studyday - b.studyday)
        .filter(d => !isNaN(d.x) && !isNaN(d.y));

    return visits;
}
