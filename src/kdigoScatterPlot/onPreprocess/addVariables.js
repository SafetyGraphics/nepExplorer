export default function addVariables() {
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
        participant.missingResult = x === undefined || y === undefined;

        // results only at one visit
        participant.singleVisit =
            !participant.missingResult &&
            ((x !== undefined && x.values.data.filter(d => !isNaN(d.result)).length === 1) ||
                (y !== undefined && y.values.data.filter(d => !isNaN(d.result)).length === 1));

        // results outside visit window
        const xVisitWindow = x !== undefined
            ? d3.min(x.values.visitWindows, visitWindow => visitWindow.studyday2 - visitWindow.studyday1)
            : undefined;
        const yVisitWindow = y !== undefined
            ? d3.min(y.values.visitWindows, visitWindow => visitWindow.studyday2 - visitWindow.studyday1)
            : undefined;
        participant.outsideWindow = !participant.singleVisit &&
            (xVisitWindow > this.config.visit_window || yVisitWindow > this.config.visit_window);

        // log axis and nonpositive maximal change
        participant.nonPositiveChange =
            !participant.outsideWindow &&
            this.config.x.type === 'log' &&
                (participant[this.config.x.column] <= 0 || participant[this.config.y.column] <= 0);

        participant.status = participant.missingResult
            ? 'Missing result'
            : participant.singleVisit
            ? 'Single visit'
            : participant.nonPositiveChange
            ? 'Nonpositive change'
            : participant.outsideWindow
            ? 'Outside visit window'
            : participant.kdigo;
    });
}
