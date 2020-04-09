export default function addHysteresisPlotContainer() {
    this.hysteresisPlotContainer = this.svg
        .append('g')
        .classed('wc-chart-customization wc-chart-customization--hysteresis-plot', true);
}
