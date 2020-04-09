export default function addOriginContainer() {
    this.originContainer = this.svg
        .append('g')
        .classed('wc-chart-customization wc-chart-customization--origin', true);
}
