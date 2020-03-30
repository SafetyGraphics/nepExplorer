import addVariables from './init/addVariables';
import defineParticipantLevelData from './init/defineParticipantLevelData';
import addEventListeners from './init/addEventListeners';

export default function init(data, participant) {
    // data manipulation
    this.data = {
        data
    };
    addVariables(this);
    this.data.participants = defineParticipantLevelData(this);

    // Attach participant value.
    this.participant = participant !== undefined ? participant : null;

    // Initialize KDIGO scatter plot.
    this.kdigoScatterPlot.nepExplorer = this;
    this.kdigoScatterPlot.init(this.data.participants);

    // Add event listeners.
    addEventListeners.call(this);
}
