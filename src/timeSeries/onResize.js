import increaseYAxisTicks from './onResize/increaseYAxisTicks';
import drawVoronoiDiagram from '../kdigoScatterPlot/onResize/drawVoronoiDiagram';
import drawReferenceLine from './onResize/drawReferenceLine';
import drawDifference from './onResize/drawDifference';
import addPointHover from '../kdigoScatterPlot/onResize/addPointHover';
import updateTooltips from './onResize/updateTooltips';
import moveLegend from './onResize/moveLegend';

export default function onResize() {
    increaseYAxisTicks.call(this);
    drawVoronoiDiagram.call(this);
    drawReferenceLine.call(this);
    drawDifference.call(this);
    addPointHover.call(this);
    updateTooltips.call(this);
    moveLegend.call(this);
}
