export default function addChartContainer(name) {
    const propertyName = name
        .toLowerCase()
        .split(' ')
        .map((str, i) => (i === 0 ? str : str.substring(0, 1).toUpperCase() + str.substring(1)))
        .join('');
    const className = name
        .toLowerCase()
        .split(' ')
        .join('-');
    this.containers[propertyName] = this.svg
        .append('g')
        .classed(`wc-chart-customization wc-chart-customization--${className}`, true);
}
