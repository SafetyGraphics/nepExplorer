export default function styles() {
    const styles = [
        /***--------------------------------------------------------------------------------------\
		  universal styles
        \--------------------------------------------------------------------------------------***/

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

        '.wc-section {',
        '    display: inline-block;',
        '}',
        '.wc-component {',
        '    display: inline-block;',
        '    width: 100%;',
        '}',

        /***--------------------------------------------------------------------------------------\
		  left side
        \--------------------------------------------------------------------------------------***/

        //'.wc-section--population {',
        //'    width: 48%;',
        //'    float: left;',
        //'}',
        '.wc-component--kdigo-scatter-plot circle.wc-data-mark {',
        '    cursor: pointer;',
        '    stroke: black;',
        '    fill-opacity: 1;',
        '    stroke-width: 1;',
        '}',
        '.wc-component--kdigo-scatter-plot circle.wc-data-mark:hover {',
        '    stroke-width: 3;',
        '}',
        '.wc-component--kdigo-scatter-plot circle.wc-data-mark.wc-selected {',
        '    stroke-width: 3;',
        '}',
        '.kdigo-stage {',
        '    stroke: black;',
        '}',
        '.wc-component--kdigo-scatter-plot .tick line {',
        '    stroke-opacity: .4;',
        '}',
        '.wc-component--kdigo-legend .interactivity {',
        '    display: none;',
        '}',
        '.wc-component--kdigo-legend table {',
        '    border-collapse: collapse;',
        '}',
        '.wc-component--kdigo-legend thead {',
        '    border-top: 2px solid #999;',
        '    border-bottom: 2px solid #999;',
        '}',
        '.wc-component--kdigo-legend thead tr {',
        '    padding: 0.1em;',
        '}',
        '.wc-component--kdigo-legend tbody {',
        '    border-bottom: 2px solid #999;',
        '}',
        '.wc-component--kdigo-legend tbody {',
        '    border-bottom: 2px solid #999;',
        '}',
        '.wc-component--kdigo-legend tbody tr {',
        '    padding: 0.1em;',
        '}',
        '.wc-component--kdigo-legend tbody td {',
        '    text-align: center;',
        '    font-size: 0.9em;',
        '    padding: 0 0.5em 0 0.5em;',
        '}',

        /***--------------------------------------------------------------------------------------\
		  right side
        \--------------------------------------------------------------------------------------***/

        //'.wc-section--participant {',
        //'    width: 48%;',
        //'    float: right;',
        //'}',
        '.wc-header {',
        '    border-top: 2px solid black;',
        '    border-bottom: 2px solid black;',
        '    padding: 0.2em;',
        '    font-weight: bold;',
        '}',
        '.wc-component__details-clear {',
        '    float: right;',
        '    margin: 0.5em;',
        '}',
        '.wc-component__details-participant {',
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
        '.wc-component--time-series-chart {',
        '    width: 100%;',
        '}',
        '.wc-diff .wc-hover-line {',
        '    stroke: #fff;',
        '    stroke-width: 16;',
        '    stroke-opacity: 0;',
        '}',
        '.wc-diff .wc-visible-line {',
        '    stroke: #aaa;',
        '    stroke-width: 2;',
        '    stroke-dasharray: 2,2;',
        '}',
        '.wc-diff .wc-visible-line.wc-hovered {',
        '    stroke: #777;',
        '    stroke-width: 4;',
        '}'
    ];

    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = styles.join('\n');
    document.getElementsByTagName('head')[0].appendChild(style);

    return style;
}
