import drawVoronoiDiagram from '../kdigoScatterPlot/onResize/drawVoronoiDiagram';
import drawReferenceLine from './onResize/drawReferenceLine';
import drawDifference from './onResize/drawDifference';
import addPointHover from '../kdigoScatterPlot/onResize/addPointHover';
import moveLegend from './onResize/moveLegend';

export default function onResize() {
    drawVoronoiDiagram.call(this);
    drawReferenceLine.call(this);
    drawDifference.call(this);
    addPointHover.call(this);
    moveLegend.call(this);
}
