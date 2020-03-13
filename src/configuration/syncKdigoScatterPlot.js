import syncBaseline from './syncKdigoScatterPlot/baseline';
import syncDetails from './syncKdigoScatterPlot/details';

export default function syncKdigoScatterPlot(settings) {
    [settings.baseline_col, settings.baseline_value] = syncBaseline(settings);
    settings.details = syncDetails(settings);

    return settings;
}
