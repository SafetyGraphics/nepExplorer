import groupControls from './onLayout/groupControls';
import labelOptions from './onLayout/labelOptions';
import updateVisitWindow from './onLayout/updateVisitWindow';
import addChartContainers from './onLayout/addChartContainers';

export default function onLayout() {
    groupControls.call(this);
    labelOptions.call(this);
    updateVisitWindow.call(this);
    addChartContainers.call(this);
}
