export default function rendererSettings() {
    return {
        id_col: 'USUBJID',
        visit_col: 'VISIT',
        visitn_col: 'VISITNUM',
        studyday_col: 'DY',
        measure_col: 'TEST',
        value_col: 'STRESN',
        unit_col: 'STRESU',
        normal_col_low: 'STNRLO',
        normal_col_high: 'STNRHI',
        filters: [],
        baseline: {
            value_col: 'ABLFL', //synced with studyday_col in syncsettings()
            values: ['Y']
        },
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
            phos: 'Phosphate',
            ca: 'Calcium',

            // blood pressure
            diabp: 'Diastolic Blood Pressure',
            sysbp: 'Systolic Blood Pressure',

            // albumin/creatinine
            alb: 'Albumin',
            albcreat: 'Albumin/Creatinine',
        },
        kdigo_criteria: {
            stage_1: {
                creat_fchg: 1.5,
                egfr_creat_fchg: 25,
                color: 'yellow',
            },
            stage_2: {
                creat_fchg: 2,
                egfr_creat_fchg: 50,
                color: 'orange',
            },
            stage_3: {
                creat_fchg: 3,
                egfr_creat_fchg: 75,
                color: 'red',
            },
        },
        kdigo_dc_criteria: {
            stage_1: {
                creat: .3,
                egfr: 25,
            },
            stage_2: {
                creat: .7,
                egfr: 50,
            },
            stage_3: {
                creat: 1.2,
                egfr: 75,
            },
        },
    };
}
