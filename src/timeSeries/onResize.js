import drawDifference from './onResize/drawDifference';

export default function onResize() {
    drawDifference.call(this);

    this.div.appendChild(this.legend.node());
}
