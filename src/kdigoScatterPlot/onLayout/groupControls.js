export default function groupControls() {
    this.controls.controlGroups = this.controls.wrap
        .selectAll('.control-group')
        .attr('class', d => `control-group control-group--${d.type}`);

    // group filters
    this.controls.filters = this.controls.controlGroups.filter(d => d.type === 'subsetter');
    this.controls.filtersHeader = this.controls.wrap
        .insert('div', '.control-group--subsetter')
        .classed('wc-subheader', true);
    this.controls.filtersHeader
        .append('span')
        .classed('wc-subheader__text', true)
        .text('Filters');
    this.controls.popCount = this.controls.filtersHeader
        .append('span')
        .classed('wc-subheader__content', true);

    // group other controls
    this.controls.settings = this.controls.controlGroups.filter(d => d.type !== 'subsetter');
    if (this.controls.settings.size()) {
        this.controls.settingsHeader = this.controls.wrap
            .insert('div', '.control-group--dropdown')
            .classed('wc-subheader', true);
        this.controls.settingsHeader
            .append('span')
            .classed('wc-subheader__text', true)
            .text('Settings');
    }
}
