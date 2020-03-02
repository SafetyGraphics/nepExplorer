export default function webchartsSettings() {
    return {
        x: {
            column: null,
            type: 'ordinal',
            label: 'Visit'
        },
        y: {
            column: null,
            type: 'linear',
            label: 'Value',
            behavior: 'flex',
            format: '0.2f'
        },
        marks: [
            {
                type: 'line',
                per: null,
                attributes: { 'stroke-width': 0.5, stroke: '#999' }
            }
        ],
        gridlines: 'xy',
        aspect: 3,
        color_by: null,
        max_width: 900
    };
}
