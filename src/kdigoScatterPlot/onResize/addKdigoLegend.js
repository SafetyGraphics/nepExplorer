import { createTable } from 'webcharts';

export default function addKdigoLegend() {
    this.kdigoSummary = this.config.criteria.slice().reverse().map(stage => {
        const datum = { ...stage };
        datum.n = this.nepExplorer.data.filtered
            .filter(d => !d.missingMeasure && !d.singleVisit && !d.nonPositiveChange)
            .filter(d => d.kdigo === datum.label).length;
        datum.rate = datum.n / this.nepExplorer.data.participants.length;
        datum.pct = d3.format('.1%')(datum.rate);

        return datum;
    });
    this.statusSummary = d3
        .nest()
        .key(d => d.status)
        .rollup(data => {
            const datum = {
                label: data[0].status,
                n: data.length
            };
            datum.rate = data.length / this.nepExplorer.data.filtered.length;
            datum.pct = d3.format('.1%')(datum.rate);

            return datum;
        })
        .entries(this.nepExplorer.data.filtered)
        .map(d => Object.assign(d, d.values))
        .sort((a, b) => (a.label < b.label ? -1 : 1));
    const totalRow = {
        label: 'Total',
        n: this.nepExplorer.data.filtered.length
    };
    totalRow.rate = totalRow.n / this.nepExplorer.data.participants.length;
    totalRow.pct = d3.format('.1%')(totalRow.rate);
    const summary = [
        ...this.kdigoSummary,
        ...this.statusSummary.filter(
            d => !this.config.criteria.map(stage => stage.label).includes(d.label)
        ),
        totalRow
    ];

    if (this.kdigoLegend) {
        this.kdigoLegend.config.headers[0] =
            this.config.criteria === this.config.kdigo_criteria ? 'KDIGO' : 'KDIGO-DC';
        this.kdigoLegend.draw(summary);
    } else {
        this.kdigoLegend = createTable(this.nepExplorer.containers.kdigoLegend.node(), {
            cols: ['label', 'n', 'pct'],
            headers: ['KDIGO', '#', '%'],
            searchable: false,
            sortable: false,
            pagination: false,
            exportable: false,
            applyCSS: false
        });
        this.kdigoLegend.kdigoChart = this;

        this.kdigoLegend.on('init', function() {
            this.initialized = true;
        });

        this.kdigoLegend.on('draw', function() {
            d3.select(this.div).style('top', this.kdigoChart.margin.top);
            this.wrap
                .selectAll('tbody td')
                .filter(d => d.col === 'label')
                .style({
                    background: d => this.data.raw.find(di => di[d.col] === d.text).color
                });
        });

        this.kdigoLegend.init(summary);
    }
}
