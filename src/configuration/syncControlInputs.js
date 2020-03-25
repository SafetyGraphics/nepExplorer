export default function syncControlInputs(controlInputs, settings) {
    // Add filters to default controls.
    if (Array.isArray(settings.filters) && settings.filters.length > 0) {
        settings.filters.forEach((filter, i) => {
            const filterObj = {
                type: 'subsetter',
                label: filter.label || filter.value_col || filter,
                description: null,
                value_col: filter.value_col || filter,
                multiple: true
            };
            controlInputs.splice(i, 0, filterObj);
        });
    }

    // Add group control.
    if (Array.isArray(settings.groups) && settings.groups.length > 0) {
        controlInputs.splice(controlInputs.length - 1, 0, {
            type: 'dropdown',
            label: 'Group',
            description: 'Grouping variable',
            options: ['color_by', 'legend.label'],
            values: settings.groups.map(group => group.value_col || group)
        });
    }

    return controlInputs;
}
