export default function drawVoronoiDiagram() {
    const mark = this.marks.find(mark => mark.type === 'circle');
    this.containers.voronoiDiagram.selectAll('*').remove();

    // add hysteresis plot points to voronoi data
    const markData =
        this.nepExplorer.participant && this.config.title === 'KDIGO Scatter Plot'
            ? mark.data.concat(this.nepExplorer.data.participant.visits.filter((d, i) => i !== 0))
            : mark.data;

    // voronoi requires a unique set of coordinates
    const uniquePoints = markData.reduce((uniqueValues, d) => {
        const existingValue = uniqueValues.find(
            di => di.values.x === d.values.x && di.values.y === d.values.y
        );

        return existingValue ? uniqueValues : [...uniqueValues, d];
    }, []);

    // voronoi generator
    const voronoiGenerator = d3.geom
        .voronoi()
        .x(d => this.x(d.values.x))
        .y(d => this.y(d.values.y))
        .clipExtent([
            [0, 0],
            [this.plot_width, this.plot_height]
        ]);

    // pass coordinates to voronoi generator
    const voronoiData = voronoiGenerator(uniquePoints);

    // add clipPaths for each voronoi partition
    const voronoiClipPaths = this.containers.voronoiDiagram
        .append('defs')
        .selectAll('clipPath')
        .data(voronoiData)
        .enter()
        .append('clipPath')
        .attr({
            class: d => 'wc-voronoi__cell',
            id: d => `wc-voronoi__cell--${d.point.key.toLowerCase().replace(/ /g, '-')}`
        })
        .append('path')
        .attr({
            d: d => `M${d.join(',')}Z`
        });

    // add gigantic circles on top of each point to make hovering easier
    mark.groups.selectAll('.wc-hover-mark').remove();
    const hoverMarks = mark.groups
        .filter(
            d =>
                this.x_dom[0] <= d.values.x &&
                d.values.x <= this.x_dom[1] &&
                this.y_dom[0] <= d.values.y &&
                d.values.y <= this.y_dom[1]
        )
        .append('circle')
        .classed('wc-hover-mark', true)
        .attr('clip-path', d => `url(#wc-voronoi__cell--${d.key.toLowerCase().replace(/ /g, '-')})`)
        .style(
            'clip-path',
            d => `url(#wc-voronoi__cell--${d.key.toLowerCase().replace(/ /g, '-')})`
        )
        .attr('cx', d => this.x(d.values.x))
        .attr('cy', d => this.y(d.values.y))
        .attr('r', 50)
        .style('fill', 'lightblue')
        .style('pointer-events', 'all')
        .style('fill-opacity', 0);

    // add paths for each voronoi partition to view voronoi diagram
    this.svg.selectAll('path.voronoi-partition').remove();
    if (this.nepExplorer.settings.synced.display_voronoi) {
        const voronoiCells = this.containers.voronoiDiagram
            .selectAll('path.voronoi-partition')
            .data(voronoiData)
            .enter()
            .insert('path', ':first-child')
            .attr({
                class: d => `voronoi-partition`,
                d: d => `M${d.join(',')}Z`
            })
            .style({
                fill: 'none',
                stroke: 'black',
                'pointer-events': 'all'
            });
    }
}
