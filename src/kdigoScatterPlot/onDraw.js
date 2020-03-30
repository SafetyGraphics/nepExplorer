import detachParticipant from './onDraw/detachParticipant';
import clearParticipant from './onDraw/clearParticipant';
import updatePopCount from './onDraw/updatePopCount';
import updateDomains from './onDraw/updateDomains';

export default function onDraw() {
    detachParticipant.call(this);
    clearParticipant.call(this);
    updatePopCount.call(this);
    updateDomains.call(this);
    this.svg.selectAll('.wc-hover-mark').remove();
}
