import defineVisitLevelData from './drawHysteresisPlot/defineVisitLevelData';
import drawPath from './drawHysteresisPlot/drawPath';
import drawPoints from './drawHysteresisPlot/drawPoints';

export default function drawHysteresisPlot() {
    this.nepExplorer.data.participant.visits = defineVisitLevelData.call(this);
    this.hysteresisPlotContainer.selectAll('*').remove();
    this.visitPath = drawPath.call(this);
    this.visitPoints = drawPoints.call(this);
}
