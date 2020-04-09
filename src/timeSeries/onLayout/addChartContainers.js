import addChartContainer from '../../kdigoScatterPlot/onLayout/addChartContainers/addChartContainer';

export default function addChartContainers() {
    this.containers = {};
    addChartContainer.call(this, 'voronoi diagram');
}
