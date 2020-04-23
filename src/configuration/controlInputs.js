export default function controlInputs() {
    return [
        {
            type: 'dropdown',
            label: 'Visit Comparison',
            description: 'all visit windows or baseline',
            option: 'visit_comparison',
            values: ['all visit windows', 'baseline'],
            require: true
        },
        {
            type: 'number',
            label: 'Visit Window',
            description: 'number of days between visits in which to calculate change',
            option: 'visit_window'
        },
        {
            type: 'dropdown',
            label: 'X-axis',
            description: null,
            option: 'x.column',
            values: ['creat_pchg', 'cystatc_pchg'],
            require: true
        },
        {
            type: 'dropdown',
            label: 'Y-axis',
            description: null,
            option: 'y.column',
            values: ['egfr_creat_pchg_inv', 'egfr_cystatc_pchg_inv', 'creat_chg', 'cystatc_chg'],
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
    ];
}
