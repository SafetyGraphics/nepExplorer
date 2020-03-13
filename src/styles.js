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

            '.wc-section--population {',
            '    width: 48%;',
            '    float: left;',
            '}',
            '.wc-component--kdigo-scatter-plot circle.wc-data-mark {',
            '    cursor: pointer;',
            '    stroke: black;',
            '    fill-opacity: 1;',
            '    stroke-width: 1;',
            '}',
            '.wc-component--kdigo-scatter-plot circle.wc-data-mark:hover {',
            '    stroke-width: 3;',
            '}',
            '.kdigo-stage {',
            '    stroke: black;',
            '}',
            '.wc-component--kdigo-scatter-plot .tick line {',
            '    stroke-opacity: .4;',
            '}',

        /***--------------------------------------------------------------------------------------\
		  right side
        \--------------------------------------------------------------------------------------***/

            '.wc-section--participant {',
            '    width: 48%;',
            '    float: right;',
            '}',
            '.wc-component__details-header {',
            '    border-top: 2px solid black;',
            '    border-bottom: 2px solid black;',
            '    padding: 0.2em;',
            '}',
            '.wc-component__details-clear {',
            '    float: right;',
            '    margin: 0.5em;',
            '}',
            '.wc-component__details-participant {',
            '    list-style: none;',
            '    padding: 0;',
            '    border-bottom: 2px solid black;',
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
    ];

    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = styles.join('\n');
    document.getElementsByTagName('head')[0].appendChild(style);

    return style;
}
