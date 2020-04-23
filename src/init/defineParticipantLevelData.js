import cartesianProduct from './defineParticipantLevelData/cartesianProduct';
import getExtremum from './defineParticipantLevelData/getExtremum';
import round from '../util/round';

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
                .filter(d => d[1] > d[0]) // && d[1] - d[0] <= settings.visit_window) // visit 2 is later than visit 1 and the difference between the visits is less than or equal to the visit window
                .map(visitWindow => {
                    const visit_window = visitWindow[1] - visitWindow[0];
                    const in_window = visit_window <= settings.visit_window;
                    const vis1 = data.find(d => d.studyday === visitWindow[0]);
                    const vis2 = data.find(d => d.studyday === visitWindow[1]);
                    const chg = vis2.result - vis1.result;
                    const pchg =
                        vis1.result > 0 ? round((vis2.result / vis1.result - 1) * 100) : null;
                    const pchg_inv = pchg !== null ? pchg * -1 : null;

                    return {
                        visitWindow,
                        studyday1: visitWindow[0],
                        studyday2: visitWindow[1],
                        visit_window,
                        in_window,
                        vis1,
                        vis2,
                        chg,
                        pchg,
                        pchg_inv
                    };
                });
            const insideVisitWindow = visitWindows.filter(visitWindow => visitWindow.in_window);

            // baseline comparison
            const baseline = data.find(d =>
                Array.isArray(settings.baseline_value)
                    ? settings.baseline_value.includes(d.baseline)
                    : settings.baseline_value === d.baseline
            );

            data.forEach(d => {
                d.baseline_result = baseline ? baseline.result : null;
                d.chg = baseline ? d.result - baseline.result : null;
                d.pchg =
                    baseline && baseline.result > 0
                        ? round((d.result / baseline.result - 1) * 100)
                        : null;
                d.pchg_inv = d.pchg !== null ? d.pchg * -1 : null;
                d.xuln = d.result > 0 && d.uln > 0 ? round(d.result / d.uln) : null;
            });

            const datum = {
                data,
                visitWindows,
                min: d3.min(data, d => d.result),
                max: d3.max(data, d => d.result),

                // extreme change from baseline
                min_chg_b: getExtremum(data, 'min', 'chg'),
                max_chg_b: getExtremum(data, 'max', 'chg'),
                min_pchg_b: getExtremum(data, 'min', 'pchg'),
                max_pchg_b: getExtremum(data, 'max', 'pchg'),

                // extreme change between visits
                min_chg: getExtremum(insideVisitWindow, 'min', 'chg'),
                max_chg: getExtremum(insideVisitWindow, 'max', 'chg'),
                min_pchg: getExtremum(insideVisitWindow, 'min', 'pchg'),
                max_pchg: getExtremum(insideVisitWindow, 'max', 'pchg')
            };

            datum.min_pchg_b_inv = datum.min_pchg_b !== null ? datum.min_pchg_b * -1 : null;
            datum.max_pchg_b_inv = datum.max_pchg_b !== null ? datum.max_pchg_b * -1 : null;
            datum.min_pchg_inv = datum.min_pchg !== null ? datum.min_pchg * -1 : null;
            datum.max_pchg_inv = datum.max_pchg !== null ? datum.max_pchg * -1 : null;

            return datum;
        })
        .entries(data);

    // Capture measure-level results at participant level.
    const measures = ['creat', 'cystatc', 'egfr_creat', 'egfr_cystatc'];
    const results = ['chg', 'pchg', 'pchg_inv', 'chg_b', 'pchg_b', 'pchg_b_inv'];
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
