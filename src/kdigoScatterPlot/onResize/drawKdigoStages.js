import defineMetadata from './drawKdigoStages/metadata';

// TODO: draw paths instead of rectangles to reduce opacity
// TODO: add table by KDIGO stage
export default function drawKdigoStages() {
    this.svg.selectAll('.kdigo-stages').remove();
    const g = this.svg.insert('g', '.axis').classed('kdigo-stages', true);

    const metadata = defineMetadata.call(this);
    const rects = g
        .selectAll('rect')
        .data(metadata)
        .enter()
        .append('rect')
        .classed('kdigo-stage', true)
        .attr({
            x: d => this.x(d.dimensions[0][0]),
            y: d => this.y(d.dimensions[1][1]),
            width: d => this.x(d.dimensions[0][1]) - this.x(d.dimensions[0][0]),
            height: d => this.y(d.dimensions[1][0]) - this.y(d.dimensions[1][1]),
            fill: d => d.color,
            'clip-path': `url(#${this.id})`
        });
    rects.append('title').text(d => d.label);
}
