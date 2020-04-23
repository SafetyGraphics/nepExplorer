import setAxisVariables from './onPreprocess/setAxisVariables';
import setAxisLabels from './onPreprocess/setAxisLabels';
import identifyCriteria from './onPreprocess/identifyCriteria';
import removeNonPositiveRecords from './onPreprocess/removeNonpositiveRecords';
import addVariables from './onPreprocess/addVariables';
import updateGrouping from './onPreprocess/updateGrouping';
import disableVisitWindowInput from './onPreprocess/disableVisitWindowInput';

export default function onPreprocess() {
    setAxisVariables.call(this);
    setAxisLabels.call(this);
    identifyCriteria.call(this);
    removeNonPositiveRecords.call(this);
    addVariables.call(this);
    updateGrouping.call(this);
    disableVisitWindowInput.call(this);
}
