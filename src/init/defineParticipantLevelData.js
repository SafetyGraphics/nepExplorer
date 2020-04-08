import cartesianProduct from './defineParticipantLevelData/cartesianProduct';
import getExtremum from './defineParticipantLevelData/getExtremum';

export default function defineParticipantLevelData({
    settings: { synced: settings },
    data: { data: data }
}) {
    const participantLevel = d3
        .nest()
        .key(d => d.id)
        .key(d => d.measure)
        .rollup(data => {
            // visit comparisons
            const studydays = [...new Set(data.map(d => d.studyday)).values()];
            const visitWindows = cartesianProduct(studydays, studydays)
                .filter(d => d[1] > d[0] && d[1] - d[0] < settings.visit_window)
                .map(visitWindow => {
                    const vis1 = data.find(d => d.studyday === visitWindow[0]);
                    const vis2 = data.find(d => d.studyday === visitWindow[1]);
                    const chg = vis2.result - vis1.result;
                    const fchg =
                        vis1.result > 0
                            ? Math.round((vis2.result / vis1.result) * 100) / 100
                            : null;
                    const pchg =
                        vis1.result > 0
                            ? Math.round((vis2.result / vis1.result - 1) * 100 * 100) / 100
                            : null;

                    return {
                        visitWindow,
                        vis1,
                        vis2,
                        chg,
                        fchg,
                        pchg
                    };
                });

            // baseline comparison
            const baseline = data.find(d =>
                Array.isArray(settings.baseline_value)
                    ? settings.baseline_value.includes(d.baseline)
                    : settings.baseline_value === d.baseline
            );

            data.forEach(d => {
                d.chg = baseline ? d.result - baseline.result : null;
                d.fchg =
                    baseline && baseline.result > 0
                        ? Math.round((d.result / baseline.result) * 100) / 100
                        : null;
                d.pchg =
                    baseline && baseline.result > 0
                        ? Math.round((d.result / baseline.result - 1) * 100 * 100) / 100
                        : null;
                d.xuln =
                    d.result > 0 && d.uln > 0 ? Math.round((d.result / d.uln) * 100) / 100 : null;
            });

            const datum = {
                data,
                visitWindows,
                min: d3.min(data, d => d.result),
                max: d3.max(data, d => d.result),

                // extreme change from baseline
                min_chg_b: getExtremum(data, 'min', 'chg'),
                max_chg_b: getExtremum(data, 'max', 'chg'),
                min_fchg_b: getExtremum(data, 'min', 'fchg'),
                max_fchg_b: getExtremum(data, 'max', 'fchg'),
                min_pchg_b: getExtremum(data, 'min', 'pchg'),
                max_pchg_b: getExtremum(data, 'max', 'pchg'),

                // extreme change between visits
                min_chg: getExtremum(visitWindows, 'min', 'chg'),
                max_chg: getExtremum(visitWindows, 'max', 'chg'),
                min_fchg: getExtremum(visitWindows, 'min', 'fchg'),
                max_fchg: getExtremum(visitWindows, 'max', 'fchg'),
                min_pchg: getExtremum(visitWindows, 'min', 'pchg'),
                max_pchg: getExtremum(visitWindows, 'max', 'pchg')
            };

            return datum;
        })
        .entries(data);

    // Capture measure-level results at participant level.
    const measures = ['creat', 'cystatc', 'egfr_creat', 'egfr_cystatc'];
    const results = ['chg', 'fchg', 'pchg'];
    participantLevel.forEach(d => {
        const datum = data.find(di => di[settings.id_col] === d.key);

        // participant details
        settings.filters.forEach(filter => {
            d[filter.value_col] = datum[filter.value_col];
        });
        settings.details.forEach(detail => {
            d[detail.value_col] = datum[detail.value_col];
        });

        // x- and y-axis
        measures.forEach(measure => {
            results.forEach(result => {
                const measure_result = `${measure}_${result}`;
                const measure_datum = d.values.find(
                    di => di.key === settings.measure_values[measure]
                );
                d[measure_result] = measure_datum ? measure_datum.values[`max_${result}`] : null;
            });
        });

        // color
        d.creat_fn = d.creat_chg >= 0.3 ? 1 : 0;
        d.cystatc_fn = d.cystatc_chg >= 0.3 ? 1 : 0;
    });

    return participantLevel;
}
