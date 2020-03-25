export default function onPreprocess() {
    this.raw_data =
        this.config.x.type === 'log'
            ? this.nepExplorer.data.participants.filter(
                  d => d[this.config.y.column] > 0 && d[this.config.x.column] > 0
              )
            : this.nepExplorer.data.participants;
    this.config.y.domain[0] =
        this.config.x.type === 'log' ? d3.min(this.raw_data, d => d[this.config.y.column]) : 0;
}
