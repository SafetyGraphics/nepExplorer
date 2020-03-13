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
        filters: [],
        groups: [],
        details: [
            { value_col: 'AGE', label: 'Age' },
            { value_col: 'SEX', label: 'Sex' },
            { value_col: 'RACE', label: 'Race' }
        ],
        baseline_value: 'Y',
        kdigo_criteria: {
            no_aki: {
                creat_fchg: 0,
                egfr_creat_chg: 0,
                color: 'white'
            },
            stage_1: {
                creat_fchg: 1.5,
                egfr_creat_chg: 25,
                color: 'yellow'
            },
            stage_2: {
                creat_fchg: 2,
                egfr_creat_chg: 50,
                color: 'orange'
            },
            stage_3: {
                creat_fchg: 3,
                egfr_creat_chg: 75,
                color: 'red'
            }
        },
        kdigo_dc_criteria: {
            stage_1: {
                creat: 0.3,
                egfr: 25,
                color: 'yellow'
            },
            stage_2: {
                creat: 0.7,
                egfr: 50,
                color: 'orange'
            },
            stage_3: {
                creat: 1.2,
                egfr: 75,
                color: 'red'
            }
        }
    };
}
