import updatePopCount from './onDraw/updatePopCount';
import updateDomains from './onDraw/updateDomains';

export default function onDraw() {
    updatePopCount.call(this);
    updateDomains.call(this);
}
