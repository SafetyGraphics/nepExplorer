export default function drawDifference() {
    this.svg.selectAll('.wc-diffs').remove();
    if (this.config.diff) {
        const g = this.svg.insert('g', '.point-supergroup').classed('wc-diffs', true);
        const mark = this.marks.find(mark => mark.type === 'circle');
        const matches = d3
            .nest()
            .key(d => d.total)
            .rollup(data => {
                const datum = {
                    n: data.length
                };

                if (data.length > 1) {
                    datum.measure1 = data[0].values.raw[0].measure;
                    datum.y1 = data[0].values.y;
                    datum.result1 = data[0].values.raw[0].result;
                    datum.measure2 = data[1].values.raw[0].measure;
                    datum.y2 = data[1].values.y;
                    datum.result2 = data[1].values.raw[0].result;
                    datum.diff = datum.y2 - datum.y1;
                }

                return datum;
            })
            .entries(mark.data)
            .filter(d => d.values.n > 1);
        const diffs = g
            .selectAll('g')
            .data(matches)
            .enter()
            .append('g')
            .classed('wc-diff', true);
        diffs
            .append('line')
            .classed('wc-visible-line', true)
            .attr({
                x1: d => this.x(+d.key),
                x2: d => this.x(+d.key),
                y1: d => this.y(d.values.y1),
                y2: d => this.y(d.values.y2)
            });
        const hoverLines = diffs
            .append('line')
            .classed('wc-hover-line', true)
            .attr({
                x1: d => this.x(+d.key),
                x2: d => this.x(+d.key),
                y1: d => this.y(d.values.y1),
                y2: d => this.y(d.values.y2)
            });
        hoverLines
            .append('title')
            .text(
                d =>
                    `Study day ${d.key}\n${d.values.measure1}: ${d.values.y1} (${d.values.result1})\n${d.values.measure2}: ${d.values.y2} (${d.values.result2})\nDifference: ${d.values.diff}`
            );
        hoverLines
            .on('mouseover', function(d) {
                d3.select(this.parentNode)
                    .select('.wc-visible-line')
                    .classed('wc-hovered', true);
            })
            .on('mouseout', function(d) {
                d3.select(this.parentNode)
                    .select('.wc-visible-line')
                    .classed('wc-hovered', false);
            });
    }
}
