export default function removeNonpositiveRecords() {
    this.raw_data =
        this.config.x.type === 'log'
            ? this.nepExplorer.data.participants.filter(
                  d => d[this.config.y.column] > 0 && d[this.config.x.column] > 0
              )
            : this.nepExplorer.data.participants;
}
