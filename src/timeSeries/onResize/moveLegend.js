export default function moveLegend() {
    this.div.appendChild(this.legend.classed('legend--time-series', true).node());
}
