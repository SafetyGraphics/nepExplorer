import clearParticipant from '../kdigoScatterPlot/onDraw/clearParticipant';

export default function addEventListeners() {
    this.containers.detailsClear.on('click', () => {
        delete this.participant;
        clearParticipant.call(this.kdigoScatterPlot);
    });
}
