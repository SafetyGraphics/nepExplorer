export default function drawReferenceLine() {
    this.svg.selectAll('.wc-reference-lines').remove();

    if (this.config.reference_lines) {
        const g = this.svg.insert('g', '.point-supergroup').classed('wc-reference-lines', true);
        const reference_lines = this.config.reference_lines.filter(
            reference_line => this.y_dom[0] <= reference_line.y && reference_line.y <= this.y_dom[1]
        );

        // lines
        g.selectAll('line')
            .data(reference_lines)
            .enter()
            .append('line')
            .classed('wc-reference-line', true)
            .attr({
                x2: this.plot_width,
                y1: d => this.y(d.y),
                y2: d => this.y(d.y)
            })
            .append('title')
            .classed('wc-reference-tooltip', true)
            .text(d => (typeof d.tooltip === 'string' ? d.tooltip : d.tooltip(this)));

        // labels
        g.selectAll('text')
            .data(reference_lines)
            .enter()
            .append('text')
            .classed('wc-reference-label', true)
            .attr({
                x: this.plot_width,
                y: d => this.y(d.y),
                dy: -4
            })
            .text(d => d.label)
            .append('title')
            .classed('wc-reference-tooltip', true)
            .text(d => (typeof d.tooltip === 'string' ? d.tooltip : d.tooltip(this)));
    }
}
