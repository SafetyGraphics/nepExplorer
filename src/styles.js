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
        '.wc-header {',
        '    font-size: 20px;',
        '    font-weight: bold;',
        '}',
        '.wc-row {',
        '    width: 100%;',
        '    display: inline-block;',
        '}',
        '.wc-component--chart {',
        '    display: inline-block;',
        '}',
        '.wc-framework .wc-component--chart {',
        '    width: 32%;',
        '}',
        '.wc-framework .wc-data-mark {',
        '    cursor: pointer;',
        '}',
        '.wc-framework .wc-component--chart-1 {',
        '    float: left;',
        '}',
        '.wc-framework .wc-component--chart-2 {',
        '    margin: 0 2%;',
        '}',
        '.wc-framework .wc-component--chart-3 {',
        '    float: right;',
        '}'
        //'.wc-framework .wc-component--chart:nth-child(3n-2) {',
        //'    float: left;',
        //'}',
        //'.wc-framework .wc-component--chart:nth-child(3n-1) {',
        //'    margin: 0 2%;',
        //'}',
        //'.wc-framework .wc-component--chart:nth-child(3n) {',
        //'    float: right;',
        //'}',
    ];

    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = styles.join('\n');
    document.getElementsByTagName('head')[0].appendChild(style);

    return style;
}
