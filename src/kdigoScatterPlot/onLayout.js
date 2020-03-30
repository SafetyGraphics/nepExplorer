import groupControls from './onLayout/groupControls';
import labelOptions from './onLayout/labelOptions';
import addVoronoiDiagramContainer from './onLayout/addVoronoiDiagramContainer';
import addHysteresisPlotContainer from './onLayout/addHysteresisPlotContainer';

export default function onLayout() {
    groupControls.call(this);
    labelOptions.call(this);
    addVoronoiDiagramContainer.call(this);
    addHysteresisPlotContainer.call(this);
}
