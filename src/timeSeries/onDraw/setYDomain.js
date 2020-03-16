export default function setYDomain() {
    if (this.config.chart === 'uln')
        this.y_dom[1] = Math.max(
            this.config.y.domain[1],
            d3.max(this.filtered_data, d => d[this.config.y.column])
        );

    if (this.config.chart === 'bp') {
        this.y_dom[0] = Math.min(
            this.config.y.domain[0],
            d3.min(this.filtered_data, d => d[this.config.y.column])
        );
        this.y_dom[1] = Math.max(
            this.config.y.domain[1],
            d3.max(this.filtered_data, d => d[this.config.y.column])
        );
    }

    if (this.config.chart === 'albcreat')
        this.y_dom[1] = Math.max(
            this.config.y.domain[1],
            d3.max(this.filtered_data, d => d[this.config.y.column])
        );
}
