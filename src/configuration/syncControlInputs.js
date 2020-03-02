export default function syncControlInputs(controlInputs, settings) {
    // use the measure column as a filter
    controlInputs.push({
        type: 'subsetter',
        value_col: settings.measure_col,
        label: 'Measure',
        required: true,
        start: 'Calcium'
    });

    //Add filters to default controls.
    if (Array.isArray(settings.filters) && settings.filters.length > 0) {
        settings.filters.forEach(filter => {
            const filterObj = {
                type: 'subsetter',
                value_col: filter.value_col || filter,
                label: filter.label || filter.value_col || filter
            };
            controlInputs.push(filterObj);
        });
    }
    return controlInputs;
}
