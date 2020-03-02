import { select } from 'd3';

export default function layout(element) {
    const container = select(element);
    container
        .append('div')
        .classed('wc-component', true)
        .attr('id', 'wc-controls');
    container
        .append('div')
        .classed('wc-component', true)
        .attr('id', 'wc-chart');
    container
        .append('div')
        .classed('wc-component', true)
        .attr('id', 'wc-listing');
}
