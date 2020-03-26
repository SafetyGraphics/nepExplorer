import addVariables from './init/addVariables';
import defineParticipantLevelData from './init/defineParticipantLevelData';
import drawVisitPath from './kdigoScatterPlot/onResize/addPointClick/drawVisitPath';
import addClearFunctionality from './init/addClearFunctionality';
import displayParticipantDetails from './init/displayParticipantDetails';
import drawTimeSeriesCharts from './init/drawTimeSeriesCharts';

export default function init(data, participant) {
    // data manipulation
    this.data = {
        data,
    };
    addVariables(this);
    this.data.participants = defineParticipantLevelData(this);

    // Initialize KDIGO scatter plot.
    this.kdigoScatterPlot.nepExplorer = this;
    this.kdigoScatterPlot.init(this.data.participants);

    // Display specified participant on initialization.
    if (participant) {
        this.participant = participant;
        this.data.participant = this.data.participants.find(d => d.key === participant);
        this.kdigoScatterPlot.marks
            .find(mark => mark.type === 'circle')
            .circles.classed('wc-selected', d => d.key === participant);
        drawVisitPath.call(this.kdigoScatterPlot);
        this.containers.detailsHeader.text('Participant Details');
        addClearFunctionality.call(this);
        displayParticipantDetails.call(this);
        drawTimeSeriesCharts.call(this);
    }
}
