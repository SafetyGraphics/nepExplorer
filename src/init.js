import addVariables from './init/addVariables';
import defineParticipantLevelData from './init/defineParticipantLevelData';

export default function init(data) {
    this.data = {
        data
    };
    addVariables(this);
    this.data.participants = defineParticipantLevelData(this);
    this.kdigoScatterPlot.nepExplorer = this;
    this.kdigoScatterPlot.init(this.data.participants);
}
