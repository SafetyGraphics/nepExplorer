import drawKdigoStages from './onResize/drawKdigoStages';
import drawVoronoiDiagram from './onResize/drawVoronoiDiagram';
import addPointClick from './onResize/addPointClick';
import displayParticipant from './onResize/displayParticipant';
import addKdigoLegend from './onResize/addKdigoLegend';
import moveLegend from './onResize/moveLegend';

export default function onResize() {
    drawKdigoStages.call(this);
    drawVoronoiDiagram.call(this);
    addPointClick.call(this);
    displayParticipant.call(this);
    addKdigoLegend.call(this);
    moveLegend.call(this);
}
