export default function onPreprocess() {
    // removeNonPositiveRecords
    this.raw_data =
        this.config.x.type === 'log'
            ? this.nepExplorer.data.participants.filter(
                  d => d[this.config.y.column] > 0 && d[this.config.x.column] > 0
              )
            : this.nepExplorer.data.participants;
    //.filter(
    //          d => d[this.config.y.column] >= 0 && d[this.config.x.column] >= 0
    //      );

    // updateYDomain
    //this.config.y.domain[0] =
    //    this.config.x.type === 'log'
    //        ? d3.min(this.raw_data, d => d[this.config.y.column])
    //        : this.config.y.column.includes('pchg')
    //        ? 1
    //        : 0;
    //if (this.config.x.type !== 'linear') {
    //    delete this.config.y.domain;
    //    delete this.config.x.domain;
    //}

    // setXLabel
    this.config.x.result = this.config.x.column.split('_').pop();
    this.config.x.measure = this.config.measure_values[
        this.config.x.column.replace(`_${this.config.x.result}`, '')
    ];
    this.config.x.label = `${this.config.x.measure}${this.config.x.result
        .replace('chg', '')
        .replace('f', ' Fold')
        .replace('p', ' Percent')} Change`;

    // setYLabel
    this.config.y.result = this.config.y.column.split('_').pop();
    this.config.y.measure = this.config.measure_values[
        this.config.y.column.replace(`_${this.config.y.result}`, '')
    ];
    this.config.y.label = `${this.config.y.measure}${this.config.y.result
        .replace('chg', '')
        .replace('f', ' Fold')
        .replace('p', ' Percent')} Change`;

    // chooseCriteria
    this.config.criteria = /_chg/.test(this.config.y.column)
        ? this.config.kdigo_dc_criteria // absolute change
        : this.config.kdigo_criteria; // fold/percent change

    // updateKdigoHeader
    this.nepExplorer.containers.kdigoHeader.text(
        this.config.criteria === this.config.kdigo_criteria
            ? 'KDIGO Scatter Plot'
            : 'KDIGO-DC Scatter Plot'
    );

    // addVariables
    this.nepExplorer.data.participants.forEach(participant => {
        // defineKdigoStage
        const kdigo = this.config.criteria
            .slice()
            .sort((a, b) => b.x - a.x)
            .find(criterion => {
                return (
                    criterion.x <= participant[this.config.x.column] ||
                    criterion.y <= participant[this.config.y.column]
                );
            });
        participant.kdigo = kdigo
            ? kdigo.label.replace(/stage_(\d)/, 'Stage $1 AKI').replace('no_aki', 'No AKI')
            : '???';

        // identifyMissingParticipants
        const x = participant.values.find(measure => measure.key === this.config.x.measure);
        const y = participant.values.find(measure => measure.key === this.config.y.measure);

        // missing a measure
        participant.missingMeasure = x === undefined || y === undefined;

        // results only at one visit
        participant.singleVisit =
            !participant.missingMeasure &&
            ((x !== undefined && x.values.data.filter(d => !isNaN(d.result)).length === 1) ||
                (y !== undefined && y.values.data.filter(d => !isNaN(d.result)).length === 1));

        // log axis and nonpositive maximal change
        participant.nonPositiveChange =
            !participant.singleVisit &&
            this.config.x.type === 'log' &&
                (participant[this.config.x.column] <= 0 || participant[this.config.y.column] <= 0);

        participant.status = participant.missingMeasure
            ? 'Missing measure'
            : participant.singleVisit
            ? 'Single visit'
            : participant.nonPositiveChange
            ? 'Nonpositive change'
            : participant.kdigo;
    });

    // setLegendLabel
    this.config.legend.label =
        this.config.color_by && this.config.color_by !== 'None'
            ? this.config.groups.find(group => group.value_col === this.config.color_by).label
            : 'All Participants';
}
