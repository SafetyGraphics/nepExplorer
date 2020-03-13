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

    // population section - KDIGO scatter plot, KDIGO legend/frequency table
    containers.population = containers.main
        .append('div')
        .classed('wc-section wc-section--population', true);
    containers.kdigoScatterPlot = containers.population
        .append('div')
        .classed('wc-component wc-component--kdigo-scatter-plot', true);
    containers.kdigoLegend = containers.population
        .append('div')
        .classed('wc-component wc-component--kdigo-legend', true);

    // participant section - participant details, time series charts
    containers.participant = containers.main
        .append('div')
        .classed('wc-section wc-section--participant', true);
    containers.detailsContainer = containers.participant
        .append('div')
        .classed('wc-component wc-component--details-container', true);
    containers.detailsHeader = containers.detailsContainer
        .append('div')
        .classed('wc-component__details-header', true)
        .text('Click a point to view participant details.');
    containers.detailsClear = containers.detailsContainer
        .append('button')
        .classed('wc-component__details-clear wc-hidden', true)
        .text('Clear');
    containers.detailsParticipant = containers.detailsContainer
        .append('ul')
        .classed('wc-component__details-participant wc-hidden', true);
    containers.timeSeries = containers.participant
        .append('div')
        .classed('wc-component wc-component--time-series wc-hidden', true);

    return containers;
}
