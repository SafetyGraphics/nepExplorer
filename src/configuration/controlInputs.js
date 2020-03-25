export default function controlInputs() {
    return [
        {
            type: 'dropdown',
            label: 'Axis Type',
            description: null,
            options: ['x.type', 'y.type'],
            values: ['linear', 'log'],
            require: true
        }
    ];
}
