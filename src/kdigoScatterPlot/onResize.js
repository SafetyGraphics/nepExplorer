import drawKdigoStages from './onResize/drawKdigoStages';
import addPointClick from './onResize/addPointClick';

export default function onResize() {
    drawKdigoStages.call(this);
    addPointClick.call(this);
}
