export default function addHysteresisPlotContainer() {
    this.hysteresisPlotContainer = this.svg.append('g').classed('wc-hysteresis-plot', true);
}
