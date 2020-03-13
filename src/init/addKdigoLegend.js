import { createTable } from 'webcharts';

export default function addKdigoLegend() {
    this.data.kdigoSummary = Object.keys(this.settings.synced.kdigo_criteria).map(stage => {
        const datum = { ...this.settings.synced.kdigo_criteria[stage] };
        datum.label = stage.replace(/stage_(\d)/, 'Stage $1 AKI').replace('no_aki', 'No AKI');
        datum.n = this.data.participants.filter(d => d.kdigo === datum.label).length;
        datum.rate = datum.n / this.data.participants.length;
        datum.pct = d3.format('.1%')(datum.rate);

        return datum;
    });
    this.kdigoLegend = createTable(this.containers.kdigoLegend.node(), {
        cols: ['label', 'n', 'pct'],
        headers: ['KDIGO', '#', '%'],
        searchable: false,
        sortable: false,
        pagination: false,
        exportable: false,
        applyCSS: false
    });
    this.kdigoLegend.on('init', function() {
        this.initialized = true;
    });
    this.kdigoLegend.on('draw', function() {
        this.wrap
            .selectAll('tbody td')
            .filter(d => d.col === 'label')
            .style({
                background: d => this.data.raw.find(di => di[d.col] === d.text).color
            });
    });
    if (this.kdigoLegend.initialized) this.kdigoLegend.draw(this.data.kdigoSummary);
    else this.kdigoLegend.init(this.data.kdigoSummary);
}
