export default function addVoronoiDiagramContainer() {
    this.voronoiDiagramContainer = this.svg
        .append('g')
        .classed('wc-voronoi-diagram', true)
        .append('defs');
}
