export default function uln() {
    return {
        title: 'Standardized Lab Values',
        measures: ['bun', 'sodium', 'k', 'bicarb', 'cl', 'phos', 'ca'],
        y: {
            column: 'xuln',
            label: '[xULN]',
            domain: [0, 3]
        }
    };
}
