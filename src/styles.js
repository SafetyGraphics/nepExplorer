export default function styles() {
    const styles = [
        '.wc-framework {',
        '    width: 100%;',
        '    display: inline-block;',
        '}',
        '.wc-hidden {',
        '    display: none !important;',
        '}',
        '.wc-invisible {',
        '    visibility: hidden;',
        '}',
        '.wc-column {',
        '    display: inline-block;',
        '}',
        '.wc-section {',
        '    display: inline-block;',
        '    width: 100%;',
        '}',
        '.wc-component {',
        '    display: inline-block;',
        '    width: 100%;',
        '}',
        '.wc-header {',
        '    border-top: 2px solid black;',
        '    border-bottom: 2px solid black;',
        '    padding: 0.2em;',
        '    font-weight: bold;',
        '}',
        '.wc-subcomponent {',
        '    width: 50%;',
        '}',
        '.wc-chart {',
        '    width: 80%;',
        '    display: inline-block;',
        '}',

        /***--------------------------------------------------------------------------------------\
		  column: left
        \--------------------------------------------------------------------------------------***/

            '.wc-column--left {',
            '    width: 20%;',
            '}',

            /****---------------------------------------------------------------------------------\
              section: controls
            \---------------------------------------------------------------------------------****/

                '.wc-section--controls {',
                '}',

        /***--------------------------------------------------------------------------------------\
		  column: right
        \--------------------------------------------------------------------------------------***/

            '.wc-column--right {',
            '    width: 78%;',
            '    float: right;',
            '}',

            /****---------------------------------------------------------------------------------\
              section: population
            \---------------------------------------------------------------------------------****/

                '.wc-section--population {',
                '}',

                /*****----------------------------------------------------------------------------\
                  component: kdigo scatter plot
                \----------------------------------------------------------------------------*****/

                    '.wc-component--kdigo {',
                    '}',
                    '.wc-subcomponent--kdigo-scatter-plot {',
                    '    position: relative;',
                    '}',
                    '.wc-subcomponent--kdigo-scatter-plot circle.wc-data-mark {',
                    '    cursor: pointer;',
                    '    stroke: black;',
                    '    fill-opacity: 1;',
                    '    stroke-width: 1;',
                    '}',
                    '.wc-subcomponent--kdigo-scatter-plot circle.wc-data-mark:hover {',
                    '    stroke-width: 3;',
                    '}',
                    '.wc-subcomponent--kdigo-scatter-plot circle.wc-data-mark.wc-selected {',
                    '    stroke-width: 3;',
                    '}',
                    '.kdigo-stage {',
                    '    stroke: black;',
                    '}',
                    '.wc-subcomponent--kdigo-scatter-plot .tick line {',
                    '    stroke-opacity: .4;',
                    '}',
                    '.wc-subcomponent__legend {',
                    '    position: absolute;',
                    '    top: 14;',
                    '    left: 80%;',
                    '    width: 100%;',
                    '}',
                    '.wc-subcomponent__legend .wc-chart {',
                    '    width: 100%;',
                    '}',
                    '.wc-subcomponent__legend .interactivity {',
                    '    display: none;',
                    '}',
                    '.wc-subcomponent__legend table {',
                    '    border-collapse: collapse;',
                    '}',
                    '.wc-subcomponent__legend thead {',
                    '    border-top: 2px solid #999;',
                    '    border-bottom: 2px solid #999;',
                    '}',
                    '.wc-subcomponent__legend thead tr {',
                    '    padding: 0.1em;',
                    '}',
                    '.wc-subcomponent__legend tbody {',
                    '    border-bottom: 2px solid #999;',
                    '}',
                    '.wc-subcomponent__legend tbody {',
                    '    border-bottom: 2px solid #999;',
                    '}',
                    '.wc-subcomponent__legend tbody tr {',
                    '    padding: 0.1em;',
                    '}',
                    '.wc-subcomponent__legend tbody td {',
                    '    text-align: center;',
                    '    font-size: 0.9em;',
                    '    padding: 0 0.5em 0 0.5em;',
                    '}',

            /****---------------------------------------------------------------------------------\
              section: participant
            \---------------------------------------------------------------------------------****/

                '.wc-section--participant {',
                '}',

                /*****----------------------------------------------------------------------------\
                  component: details
                \----------------------------------------------------------------------------*****/

                    '.wc-component__details-clear {',
                    '    float: right;',
                    '    margin: 0.5em;',
                    '}',
                    '.wc-subcomponent__details-participant {',
                    '    list-style: none;',
                    '    padding: 0;',
                    '}',
                    '.wc-details__li {',
                    '    display: inline-block;',
                    '    text-align: center;',
                    '    padding: 0.5em;',
                    '}',
                    '.wc-details__label {',
                    '    font-size: 0.8em;',
                    '}',
                    '.wc-details__value {',
                    '}',

                /*****----------------------------------------------------------------------------\
                  component: time series
                \----------------------------------------------------------------------------*****/

                    '.wc-diff .wc-hover-line {',
                    '    stroke: #fff;',
                    '    stroke-width: 16;',
                    '    stroke-opacity: 0;',
                    '}',
                    '.wc-diff .wc-visible-line {',
                    '    stroke-width: 2;',
                    '    stroke: #8E4C6A;',
                    '    stroke-dasharray: 3 3;',
                    '}',
                    '.wc-diff .wc-visible-line.wc-hovered {',
                    '    stroke-dasharray: 0;',
                    '}',
                    '.wc-component--time-series .axis-title {',
                    '    font-size: 14px;',
                    '    font-weight: bold;',
                    '}',
                    '.wc-chart-container {',
                    '    position: relative;',
                    '}',
                    '.legend {',
                    //'    width: 20% !important;',
                    //'    display: inline-block;',
                    //'    float: right;',
                    '    position: absolute;',
                    '    top: 14;',
                    '    left: 80%;',
                    '    width: 100%;',
                    '}',
                    '.legend-item {',
                    '    float: left;',
                    '    clear: left;',
                    '    margin-right: 0 !important;',
                    '}',
                    '.legend-mark-text {',
                    '    display: none;',
                    '}',
                    '.legend-label {',
                    '    margin-right: .55em;',
                    '    font-size: 12px;',
                    '}',
                    '.legend-color-block {',
                    '}',
                    '.wc-reference-lines {',
                    '    cursor: help;',
                    '}',
                    '.wc-reference-line {',
                    '    x1: 0;',
                    '    stroke: #999;',
                    '    stroke-dasharray: 3 3;',
                    '}',
                    '.wc-reference-label {',
                    '    text-anchor: end;',
                    '    alignment-baseline: baseline;',
                    '    fill: #999;',
                    '}'
    ];

    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = styles.join('\n');
    document.getElementsByTagName('head')[0].appendChild(style);

    return style;
}
