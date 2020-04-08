import clearParticipant from '../kdigoScatterPlot/onDraw/clearParticipant';
import konamiCode from '../util/konamiCode';

export default function addEventListeners() {
    this.containers.detailsClear.on('click', () => {
        delete this.participant;
        clearParticipant.call(this.kdigoScatterPlot);
    });

    konamiCode(() => {
        this.settings.synced.display_voronoi = !this.settings.synced.display_voronoi;
        this.kdigoScatterPlot.draw();
    });
}
