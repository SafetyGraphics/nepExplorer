import { select } from 'd3';

export default function layout(element) {
    const containers = {
        main: select(element)
            .append('div')
            .classed('wc-framework', true)
    };
    containers.controls = containers.main
        .append('div')
        .classed('wc-component wc-component--controls', true);
    containers.kdigoScatterPlot = containers.main
        .append('div')
        .classed('wc-component wc-component--chart wc-component--kdigo-scatter-plot', true);
    containers.timeSeries = containers.main
        .append('div')
        .classed('wc-component wc-component--time-series', true);
    containers.timeSeriesNote = containers.timeSeries
        .append('div')
        .classed('wc-note wc-component--time-series__note', true)
        .text('Click a point to view associated charts.');

    return containers;
}
