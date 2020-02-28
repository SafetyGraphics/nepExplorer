export default function styles() {
    const styles = [
        '.wc-chart path.highlighted{',
        'stroke-width:3px;',
        '}',
        '.wc-chart path.selected{',
        'stroke-width:5px;',
        'stroke:orange;',
        '}'
    ];
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = styles.join('\n');
    document.getElementsByTagName('head')[0].appendChild(style);
}
