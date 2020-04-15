export default function identifyCriteria() {
    this.config.criteria = /_chg/.test(this.config.y.column)
        ? this.config.kdigo_dc_criteria // absolute change
        : this.config.kdigo_criteria; // percent change

    this.nepExplorer.containers.kdigoHeader.text(
        this.config.criteria === this.config.kdigo_criteria
            ? 'KDIGO Scatter Plot'
            : 'KDIGO-DC Scatter Plot'
    );
}
