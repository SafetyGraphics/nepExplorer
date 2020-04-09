export default function addVoronoiDiagramContainer() {
    this.voronoiPlotContainer = this.svg
        .append('g')
        .classed('wc-chart-customization wc-chart-customization--voronoi-diagram', true)
        .append('defs');
}
