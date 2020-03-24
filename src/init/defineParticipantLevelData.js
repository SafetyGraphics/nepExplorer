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
    participantLevel.forEach(d => {
        const datum = data.find(di => di[settings.id_col] === d.key);

        // participant details
        settings.details.forEach(detail => {
            d[detail.value_col] = datum[detail.value_col];
        });

        // x-axis
        const creat = d.values.find(di => di.key === settings.measure_values.creat);
        d.creat_fchg = creat ? creat.values.max_fchg : null;
        const cystatc = d.values.find(di => di.key === settings.measure_values.cystatc);
        d.cystatc_fchg = cystatc ? cystatc.values.max_fchg : null;

        // y-axis
        const egfr_creat = d.values.find(di => di.key === settings.measure_values.egfr_creat);
        d.egfr_creat_chg = egfr_creat ? (egfr_creat.values.max_fchg - 1) * 100 : null;
        const egfr_cystatc = d.values.find(di => di.key === settings.measure_values.egfr_cystatc);
        d.egfr_cystatc_chg = egfr_cystatc ? egfr_cystatc.values.max_chg : null;

        // KDIGO stage
        const kdigo = settings.kdigo_criteria
            .slice()
            .sort((a,b) => b.x - a.x)
            .find(criterion => {
                return (
                    criterion.x <= d.creat_fchg ||
                    criterion.y <= d.egfr_creat_chg
                );
            })
            .label;
        d.kdigo = kdigo
            ? kdigo.replace(/stage_(\d)/, 'Stage $1 AKI').replace('no_aki', 'No AKI')
            : '???';

        // color
        d.creat_fn = d.creat_chg >= 0.3 ? 1 : 0;
        d.cystatc_fn = d.cystatc_chg >= 0.3 ? 1 : 0;
    });

    return participantLevel;
}
