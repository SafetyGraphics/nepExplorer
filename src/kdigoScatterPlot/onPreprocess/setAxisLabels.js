export default function setAxisLabels() {
    ['x', 'y'].forEach(axis => {
        this.config[axis].result = this.config[axis].column.substring(
            this.config[axis].column.search(/_.?chg/) + 1
        );
        this.config[axis].measure = this.config.measure_values[
            this.config[axis].column.replace(`_${this.config[axis].result}`, '')
        ];
        this.config[axis].label = `${this.config[axis].measure} ${this.config[axis].result
            .replace(/^chg$/, 'Change')
            .replace(/^pchg$/, 'Percent Increase')
            .replace(/^pchg_inv$/, 'Percent Decrease')}`;
    });
}
