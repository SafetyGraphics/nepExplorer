export default function controlInputs() {
    return [
        {
            type: 'dropdown',
            label: 'X-axis',
            description: 'From baseline',
            option: 'x.column',
            values: ['creat_fchg', 'cystatc_fchg'],
            require: true
        },
        {
            type: 'dropdown',
            label: 'Y-axis',
            description: 'From baseline',
            option: 'y.column',
            values: ['egfr_creat_pchg', 'egfr_cystatc_pchg', 'creat_chg', 'cystatc_chg'],
            require: true
        },
        {
            type: 'dropdown',
            label: 'Axis Type',
            description: 'log or linear',
            options: ['x.type', 'y.type'],
            values: ['log', 'linear'],
            require: true
        }
    ];
}
