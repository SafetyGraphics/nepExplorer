import addChartContainer from './addChartContainers/addChartContainer';

export default function addChartContainers() {
    this.containers = {};
    addChartContainer.call(this, 'origin');
    addChartContainer.call(this, 'voronoi diagram');
    addChartContainer.call(this, 'hysteresis plot');
}
