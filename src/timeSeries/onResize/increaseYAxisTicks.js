export default function increaseYAxisTicks() {
    const yAxis = this.svg.select('g.y.axis');
    yAxis.selectAll('.tick').remove();
    this.yAxis.ticks(4);
    yAxis.call(this.yAxis);
    this.drawGridlines();
}
