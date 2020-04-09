export default function renderer() {
    return {
        // data mappings
        id_col: 'USUBJID',
        visit_col: 'VISIT',
        visitn_col: 'VISITNUM',
        studyday_col: 'DY',
        measure_col: 'TEST',
        value_col: 'STRESN',
        unit_col: 'STRESU',
        normal_col_low: 'STNRLO',
        normal_col_high: 'STNRHI',
        baseline_col: 'ABLFL',

        // value mappings
        measure_values: {
            // creatinine-based measures
            creat: 'Creatinine',
            egfr_creat: 'eGFR',

            // cystatin C-based measures
            cystatc: 'Cystatin C',
            egfr_cystatc: 'eGFRcys',

            // kidney function-related measures
            bun: 'Blood Urea Nitrogen',
            sodium: 'Sodium',
            k: 'Potassium',
            bicarb: 'Bicarbonate',
            cl: 'Chloride',
            phos: 'Phosphorus',
            ca: 'Calcium',

            // blood pressure
            diabp: 'Diastolic Blood Pressure',
            sysbp: 'Systolic Blood Pressure',

            // albumin/creatinine
            alb: 'Albumin',
            albcreat: 'Albumin/Creatinine'
        },

        // renderer settings
        filters: [
            { value_col: 'ARM', label: 'Treatment Group' },
            { value_col: 'AGEGRP', label: 'Age Group' },
            { value_col: 'SEX', label: 'Sex' },
            { value_col: 'RACE', label: 'Race' }
        ],
        groups: [
            { value_col: 'ARM', label: 'Treatment Group' },
            { value_col: 'AGEGRP', label: 'Age Group' },
            { value_col: 'SEX', label: 'Sex' },
            { value_col: 'RACE', label: 'Race' }
        ],
        details: [{ value_col: 'AGE', label: 'Age' }],
        baseline_value: 'Y',
        visit_window: 9999,
        kdigo_criteria: [
            {
                label: 'No AKI',
                x: -Infinity,
                y: -Infinity,
                color: 'white'
            },
            {
                label: 'Stage 1 AKI',
                x: 50,
                y: 25,
                color: '#ffffbf'
            },
            {
                label: 'Stage 2 AKI',
                x: 100,
                y: 50,
                color: '#fdae61'
            },
            {
                label: 'Stage 3 AKI',
                x: 200,
                y: 75,
                color: '#d73027'
            }
        ],
        kdigo_dc_criteria: [
            {
                label: 'No AKI',
                x: -Infinity,
                y: -Infinity,
                color: 'white'
            },
            {
                label: 'Stage 1 AKI',
                x: 50,
                y: 0.3,
                color: '#ffffbf'
            },
            {
                label: 'Stage 2 AKI',
                x: 100,
                y: 0.7,
                color: '#fdae61'
            },
            {
                label: 'Stage 3 AKI',
                x: 200,
                y: 1.2,
                color: '#d73027'
            }
        ]
    };
}
