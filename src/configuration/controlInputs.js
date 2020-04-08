export default function controlInputs() {
    return [
        {
            type: 'dropdown',
            label: 'X-axis',
            description: 'From baseline',
            option: 'x.column',
            values: ['creat_pchg', 'cystatc_pchg'],
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
        },
        {
            type: 'number',
            label: 'Visit Window',
            description: 'number of days between visits in which to calculate change',
            option: 'visit_window'
        }
    ];
}
