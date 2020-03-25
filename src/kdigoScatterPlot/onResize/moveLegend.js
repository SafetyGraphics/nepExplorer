export default function moveLegend() {
    //d3.select(this.div).node().appendChild(
    this.legend.classed('legend--kdigo', true).style('margin-left', this.margin.left);
    //        .node()
    //);
}
