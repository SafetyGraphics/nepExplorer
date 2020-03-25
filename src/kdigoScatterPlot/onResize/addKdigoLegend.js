import { createTable } from 'webcharts';

export default function addKdigoLegend() {
    this.kdigoSummary = this.config.kdigo_criteria.map(stage => {
        const datum = { ...stage };
        datum.n = this.filtered_data.filter(d => d.kdigo === datum.label).length;
        datum.rate = datum.n / this.filtered_data.length;
        datum.pct = d3.format('.1%')(datum.rate);

        return datum;
    });

    if (this.kdigoLegend) this.kdigoLegend.draw(this.kdigoSummary);
    else {
        this.kdigoLegend = createTable(this.nepExplorer.containers.kdigoLegend.node(), {
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

        this.kdigoLegend.init(this.kdigoSummary);
    }
}
