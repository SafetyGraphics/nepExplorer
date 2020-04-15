import removeNonPositiveRecords from './onPreprocess/removeNonpositiveRecords';
import setAxisLabels from './onPreprocess/setAxisLabels';
import identifyCriteria from './onPreprocess/identifyCriteria';
import addVariables from './onPreprocess/addVariables';
import updateGrouping from './onPreprocess/updateGrouping';

export default function onPreprocess() {
    removeNonPositiveRecords.call(this);
    setAxisLabels.call(this);
    identifyCriteria.call(this);
    addVariables.call(this);
    updateGrouping.call(this);
}
