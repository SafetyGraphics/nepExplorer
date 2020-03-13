export default function addVariables({ settings: { synced: settings }, data: { data: data } }) {
    data.forEach(d => {
        d.id = d[settings.id_col];
        d.visit = d[settings.visit_col];
        d.visitn = parseFloat(d[settings.visitn_col]);
        d.studyday = parseFloat(d[settings.studyday_col]);
        d.measure = d[settings.measure_col];
        d.result = parseFloat(d[settings.value_col]);
        d.unit = d[settings.unit_col];
        d.lln = parseFloat(d[settings.normal_col_low]);
        d.uln = parseFloat(d[settings.normal_col_high]);
        d.baseline = d[settings.baseline_col];
    });

    return data;
}
