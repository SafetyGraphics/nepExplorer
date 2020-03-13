import addVariables from './init/addVariables';
import defineParticipantLevelData from './init/defineParticipantLevelData';
import addKdigoLegend from './init/addKdigoLegend';
import addClearFunctionality from './init/addClearFunctionality';
import displayParticipantDetails from './init/displayParticipantDetails';
import drawTimeSeriesCharts from './init/drawTimeSeriesCharts';

export default function init(data, id) {
    this.data = {
        data,
        selected: id
    };
    addVariables(this);
    this.data.participants = defineParticipantLevelData(this);
    this.kdigoScatterPlot.nepExplorer = this;
    this.kdigoScatterPlot.init(this.data.participants);
    addKdigoLegend.call(this);

    // Display specified participant on initialization.
    if (id) {
        this.kdigoScatterPlot.marks
            .find(mark => mark.type === 'circle')
            .circles.classed('wc-selected', d => d.key === id);
        this.containers.detailsHeader.text('Participant Details');
        addClearFunctionality.call(this);
        displayParticipantDetails.call(this, id);
        drawTimeSeriesCharts.call(this, id);
    }
}
