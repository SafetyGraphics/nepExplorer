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
    containers.chart1 = containers.main
        .append('div')
        .classed('wc-component wc-component--chart wc-component--chart-1', true);
    containers.chart1
        .append('span')
        .classed('wc-header', true)
        .text('KDIGO Stages');
    containers.chart2 = containers.main
        .append('div')
        .classed('wc-component wc-component--chart wc-component--chart-2', true);
    containers.chart2
        .append('span')
        .classed('wc-header', true)
        .text('Percent Change from Baseline by Study Day');
    containers.chart3 = containers.main
        .append('div')
        .classed('wc-component wc-component--chart wc-component--chart-3', true);
    containers.chart3
        .append('span')
        .classed('wc-header', true)
        .text('Standardized Result [xULN] by Study Day');

    return containers;
}
