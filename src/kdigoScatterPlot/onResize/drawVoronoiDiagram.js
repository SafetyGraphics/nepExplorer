export default function drawVoronoiDiagram() {
    const mark = this.marks.find(mark => mark.type === 'circle');
    this.voronoiDiagramContainer.selectAll('*').remove();
    const uniquePoints = mark.data
        .reduce(
            (uniqueValues,d) => {
                const existingValue = uniqueValues.find(di => di.values.x === d.values.x && di.values.y === d.values.y);

                return existingValue ? uniqueValues : [...uniqueValues, d];
            },
            []
        ); // voronoi requires a unique set of coordinates
    const voronoiGenerator = d3.geom.voronoi()
        .x(d => this.x(d.values.x))
        .y(d => this.y(d.values.y))
        .clipExtent([[0, 0], [this.plot_width, this.plot_height]]);
    const voronoiData = voronoiGenerator(uniquePoints);
    const voronoiClipPaths = this.voronoiDiagramContainer
        .selectAll('clipPath')
        .data(voronoiData)
        .enter()
        .append('clipPath')
        .attr({
            class: d => 'wc-voronoi__cell',
            id: d => `wc-voronoi__cell--${d.point.key}`,
        })
        .append('path')
        .attr({
            d: d => `M${d.join(',')}Z`,
        });
    const hoverMarks = mark.groups
        .filter(d => (
            this.x_dom[0] <= d.values.x && d.values.x <= this.x_dom[1] &&
            this.y_dom[0] <= d.values.y && d.values.y <= this.y_dom[1]
        ))
        .insert('circle', ':first-child')
        .classed('wc-hover-mark', true)
        .attr('clip-path', d => `url(#wc-voronoi__cell--${d.key})`)
        .style('clip-path', d => `url(#wc-voronoi__cell--${d.key})`)
        .attr('cx', d => this.x(d.values.x))
        .attr('cy', d => this.y(d.values.y))
        .attr('r', 50)
        .style('fill', 'lightblue')
        .style('pointer-events', 'all')
        .style('fill-opacity', 0);
    //this.svg.selectAll('path.voronoi-partition').remove();
    //const voronoiCells = this.svg
    //    .selectAll('path.voronoi-partition')
    //    .data(voronoiData)
    //    .enter()
    //    .append('path')
    //    .attr({
    //        class: d => `voronoi-partition`,
    //        d: d => `M${d.join(',')}Z`,
    //    })
    //    .style({
    //        fill: 'none',
    //        stroke: 'black',
    //        'pointer-events': 'all',
    //    });
}
