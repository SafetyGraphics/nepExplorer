export default function syncControlInputs(controlInputs, settings) {
    // Add filters to default controls.
    if (Array.isArray(settings.filters) && settings.filters.length > 0) {
        settings.filters.forEach(filter => {
            const filterObj = {
                type: 'subsetter',
                label: filter.label || filter.value_col || filter,
                description: null,
                value_col: filter.value_col || filter,
                multiple: true
            };
            controlInputs.push(filterObj);
        });
    }

    // Add group control.
    if (Array.isArray(settings.groups) && settings.groups.length > 0) {
        controlInputs.push({
            type: 'dropdown',
            label: 'Group',
            description: 'Grouping variable',
            options: ['color_by', 'legend.label'],
            values: settings.groups.map(group => group.value_col || group)
        });
    }

    return controlInputs;
}
