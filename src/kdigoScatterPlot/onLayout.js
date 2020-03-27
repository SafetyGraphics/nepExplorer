import groupControls from './onLayout/groupControls';
import labelOptions from './onLayout/labelOptions';
import appendHysteresisPlotContainer from './onLayout/appendHysteresisPlotContainer';

export default function onLayout() {
    groupControls.call(this);
    labelOptions.call(this);
    appendHysteresisPlotContainer.call(this);
}
