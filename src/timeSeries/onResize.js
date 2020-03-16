import drawReferenceLine from './onResize/drawReferenceLine';
import drawDifference from './onResize/drawDifference';
import moveLegend from './onResize/moveLegend';

export default function onResize() {
    drawReferenceLine.call(this);
    drawDifference.call(this);
    moveLegend.call(this);
}
