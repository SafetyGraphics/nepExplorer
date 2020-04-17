import drawKdigoStages from './onResize/drawKdigoStages';
import drawOrigin from './onResize/drawOrigin';
import drawVoronoiDiagram from './onResize/drawVoronoiDiagram';
import updateTooltips from './onResize/updateTooltips';
import addPointHover from './onResize/addPointHover';
import addPointClick from './onResize/addPointClick';
import displayParticipant from './onResize/displayParticipant';
import addKdigoLegend from './onResize/addKdigoLegend';
import moveLegend from './onResize/moveLegend';

export default function onResize() {
    drawKdigoStages.call(this);
    drawOrigin.call(this);
    updateTooltips.call(this);
    displayParticipant.call(this); // draw hysteresis plot before voronoi digram to provide hysteresis plot points to voronoi digram
    drawVoronoiDiagram.call(this); // add voronoi diagram after hysteresis plot to include hysteresis plot points in voronoi diagram
    addPointHover.call(this); // add point hover after voronoi diagram to include hover marks in mouseover and mouseout event listeners
    addPointClick.call(this); // add point click after voronoi diagram to include hover marks in click event listener
    addKdigoLegend.call(this);
    moveLegend.call(this);
}
