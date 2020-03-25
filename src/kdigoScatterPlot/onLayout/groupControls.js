export default function groupControls() {
    this.controls.controlGroups = this.controls.wrap
        .selectAll('.control-group')
        .attr('class', d => `control-group control-group--${d.type}`);
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
}
