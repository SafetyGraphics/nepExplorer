import { select } from 'd3';

export default function layout(element) {
    const containers = {
        main: select(element)
            .append('div')
            .classed('wc-framework', true)
    };

    // column: left
    containers.leftColumn = containers.main
        .append('div')
        .classed('wc-column wc-column--left', true);

        // section: controls
        containers.controls = containers.leftColumn
            .append('div')
            .classed('wc-section wc-section--controls', true);

    // column: right
    containers.rightColumn = containers.main
        .append('div')
        .classed('wc-column wc-column--right', true);

        // section: population
        containers.population = containers.rightColumn
            .append('div')
            .classed('wc-section wc-section--population', true);

        // component: kdigo scatter plot
        containers.kdigo = containers.population
            .append('div')
            .classed('wc-component wc-component--kdigo', true)

            // header
            containers.kdigoHeader = containers.kdigo
                .append('div')
                .classed('wc-header wc-header--kdigo-scatter-plot', true)
                .text('KDIGO Scatter Plot');

            // content
            containers.kdigoScatterPlot = containers.kdigo
                .append('div')
                .classed('wc-subcomponent wc-subcomponent--kdigo-scatter-plot', true);

            containers.kdigoLegend = containers.kdigoScatterPlot
                .append('div')
                .classed('wc-subcomponent__legend', true);

    // section: participant
    containers.participant = containers.rightColumn
        .append('div')
        .classed('wc-section wc-section--participant', true);

        // component: details
        containers.detailsContainer = containers.participant
            .append('div')
            .classed('wc-component wc-component--details-container', true);

            // header
            containers.detailsHeader = containers.detailsContainer
                .append('div')
                .classed('wc-header wc-header--details', true);

            containers.detailsHeaderText = containers.detailsHeader
                .append('span')
                .classed('wc-header__text', true)
                .text('Click a point to view participant details.');

            containers.detailsClear = containers.detailsHeader
                .append('button')
                .classed('wc-header__button wc-component__details-clear wc-hidden', true)
                .text('Clear');

            // content
            containers.detailsParticipant = containers.detailsContainer
                .append('ul')
                .classed('wc-subcomponent wc-subcomponent__details-participant wc-hidden', true);

        // component: time series
        containers.timeSeries = containers.participant
            .append('div')
            .classed('wc-component wc-component--time-series wc-hidden', true);

    return containers;
}
