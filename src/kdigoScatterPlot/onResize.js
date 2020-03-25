import drawKdigoStages from './onResize/drawKdigoStages';
import addPointClick from './onResize/addPointClick';
import addKdigoLegend from './onResize/addKdigoLegend';
import moveLegend from './onResize/moveLegend';

export default function onResize() {
    console.log(this.marks);
    drawKdigoStages.call(this);
    addPointClick.call(this);
    addKdigoLegend.call(this);
    moveLegend.call(this);
}
