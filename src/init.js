import addVariables from './init/addVariables';
import defineParticipantLevelData from './init/defineParticipantLevelData';

export default function init(data) {
    this.data = {
        data
    };
    addVariables(this);
    this.data.participants = defineParticipantLevelData(this);
    this.chart.init(this.data.participants);
    const participant = this.data.participants.find(d => d.key === '02-008');
    const chart2measures = d3.merge(
        participant.values
            .filter(d =>
                [
                    this.settings.synced.measure_values.creat,
                    this.settings.synced.measure_values.cystatc
                ].includes(d.key)
            )
            .map(d => d.values.data)
    );
    this.chart2.init(chart2measures);
    const chart3measures = d3.merge(
        participant.values
            .filter(d =>
                [
                    this.settings.synced.measure_values.bun,
                    this.settings.synced.measure_values.sodium,
                    this.settings.synced.measure_values.k,
                    this.settings.synced.measure_values.bicarb,
                    this.settings.synced.measure_values.cl,
                    this.settings.synced.measure_values.phos,
                    this.settings.synced.measure_values.ca
                ].includes(d.key)
            )
            .map(d => d.values.data)
    );
    this.chart3.init(chart3measures);
}
