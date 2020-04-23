import syncBaseline from './syncKdigoScatterPlot/baseline';
import syncDetails from './syncKdigoScatterPlot/details';

export default function syncKdigoScatterPlot(settings) {
    settings.axis_type = ['linear', 'log'].includes(settings.axis_type) ? settings.axis_type : 'linear';
    settings.x.type = settings.axis_type;
    settings.y.type = settings.axis_type;
    [settings.baseline_col, settings.baseline_value] = syncBaseline(settings);
    settings.details = syncDetails(settings);

    return settings;
}
