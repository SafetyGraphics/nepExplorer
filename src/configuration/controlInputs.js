export default function controlInputs() {
    return [
        {
            type: 'dropdown',
            values: ['log', 'linear'],
            label: 'Log/Linear',
            option: 'y.type',
            require: true,
            start: 'linear'
        }
    ];
}
