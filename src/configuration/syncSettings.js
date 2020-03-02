export default function syncSettings(settings) {
    // webcharts settings
    settings.x.column = settings.visitn_col;
    settings.y.column = settings.value_col;
    settings.marks[0].per = [settings.id_col];
    return settings;
}
