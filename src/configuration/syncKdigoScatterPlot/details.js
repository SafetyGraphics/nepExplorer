export default function details(settings) {
    // Define default details.
    const details = [
        { value_col: settings.id_col, label: 'Subject Identifier' },
        { value_col: 'kdigo', label: 'KDIGO' }
    ];

    // Add filters to default details.
    if (settings.filters)
        settings.filters.forEach(filter => {
            const obj = {
                value_col: filter.value_col ? filter.value_col : filter,
                label: filter.label ? filter.label : filter.value_col ? filter.value_col : filter
            };

            if (details.find(detail => detail.value_col === detail.value_col) === undefined)
                details.push(obj);
        });

    // Add groups to default details.
    if (settings.groups)
        settings.groups
            .filter(group => group.value_col !== 'NONE')
            .forEach(group => {
                const obj = {
                    value_col: group.value_col ? group.value_col : filter,
                    label: group.label ? group.label : group.value_col ? group.value_col : filter
                };

                if (details.find(detail => detail.value_col === obj.value_col) === undefined)
                    details.push(obj);
            });

    // Convert details to array to array if needed
    if (!(settings.details instanceof Array))
        settings.details = typeof settings.details == 'string' ? [settings.details] : [];

    // Use default details if detailsIf [settings.details] is not specified:
    if (!settings.details) settings.details = details;
    else {
        //If [settings.details] is specified:
        //Allow user to specify an array of columns or an array of objects with a column property
        //and optionally a column label.
        settings.details.forEach(detail => {
            if (
                details
                    .map(d => d.value_col)
                    .indexOf(detail.value_col ? detail.value_col : detail) === -1
            )
                details.push({
                    value_col: detail.value_col ? detail.value_col : detail,
                    label: detail.label
                        ? detail.label
                        : detail.value_col
                        ? detail.value_col
                        : detail
                });
        });
        settings.details = details;
    }

    return details;
}
