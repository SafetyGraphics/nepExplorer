export default function baseline(settings) {
    // Map settings.baseline (an object with properties [ value_col  ] and [ values ]) to settings.baseline_col and settings.baseline_value.
    if (settings.baseline) {
        if (settings.baseline.value_col && settings.baseline.value_col !== settings.baseline_col)
            settings.baseline_col = settings.baseline.value_col;
        if (settings.baseline.values && settings.baseline.values !== settings.baseline_value)
            settings.baseline_value = settings.baseline.values;
    }

    return [settings.baseline_col,settings.baseline_value];
}
