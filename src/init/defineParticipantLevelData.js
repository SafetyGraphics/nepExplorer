export default function defineParticipantLevelData({
    settings: { synced: settings },
    data: { data: data }
}) {
    const participantLevel = d3
        .nest()
        .key(d => d.id)
        .key(d => d.measure)
        .rollup(data => {
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
                data
            };

            datum.min = d3.min(datum.data, d => d.result);
            datum.max = d3.max(datum.data, d => d.result);
            datum.min_chg = d3.min(datum.data, d => d.chg);
            datum.max_chg = d3.max(datum.data, d => d.chg);
            datum.min_fchg = d3.min(datum.data, d => d.fchg);
            datum.max_fchg = d3.max(datum.data, d => d.fchg);
            datum.min_pchg = d3.min(datum.data, d => d.pchg);
            datum.max_pchg = d3.max(datum.data, d => d.pchg);

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
                const measure_datum = d.values.find(di => di.key === settings.measure_values[measure]);
                d[measure_result] = measure_datum ? measure_datum.values[`max_${result}`] : null;
            });
        });

        // color
        d.creat_fn = d.creat_chg >= 0.3 ? 1 : 0;
        d.cystatc_fn = d.cystatc_chg >= 0.3 ? 1 : 0;
    });

    return participantLevel;
}
