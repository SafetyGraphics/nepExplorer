export default function drawOrigin() {
    this.containers.origin.selectAll('*').remove();

    if (this.x_dom[0] < 0) {
        this.containers.origin
            .append('line')
            .classed('wc-origin wc-origin--x', true)
            .attr({
                x1: this.x(0),
                x2: this.x(0),
                y1: 0,
                y2: this.plot_height,
                stroke: 'black',
                'stroke-width': 2
            });
    }

    if (this.y_dom[0] < 0) {
        this.containers.origin
            .append('line')
            .classed('wc-origin wc-origin--y', true)
            .attr({
                x1: 0,
                x2: this.plot_width,
                y1: this.y(0),
                y2: this.y(0),
                stroke: 'black',
                'stroke-width': 2
            });
    }
}
