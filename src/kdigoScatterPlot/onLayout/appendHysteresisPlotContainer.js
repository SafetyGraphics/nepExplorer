export default function appendHysteresisPlotContainer() {
    this.hysteresisPlotContainer = this.svg.append('g').classed('wc-hysteresis-plot', true);
}
