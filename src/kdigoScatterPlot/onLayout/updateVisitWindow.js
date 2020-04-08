import defineParticipantLevelData from '../../init/defineParticipantLevelData';

export default function updateVisitWindow() {
    const chart = this;

    this.controls.visitWindow = this.controls.wrap
        .selectAll('.control-group')
        .filter(d => d.label === 'Visit Window');
    this.controls.visitWindow.selectAll('input').on('change', function() {
        console.log(this.value);
        chart.nepExplorer.settings.synced.visit_window = this.value;
        chart.nepExplorer.data.participants = defineParticipantLevelData(chart.nepExplorer);
        chart.draw();
    });
}
