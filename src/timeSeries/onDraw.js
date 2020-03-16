export default function onDraw() {
    if (this.config.y.column === 'xuln')
        this.y_dom[1] = Math.max(
            this.config.y.domain[1],
            d3.max(this.filtered_data, d => d.xuln)
        );
}
