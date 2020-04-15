export default function updateGrouping() {
    if (this.config.color_by && this.config.color_by !== 'None') {
        this.config.color_dom = [...new Set(this.nepExplorer.data.participants.map(participant => participant[this.config.color_by])).values()].sort();
        this.config.legend.order = this.config.color_dom.slice();
        this.config.legend.label = this.config.groups.find(group => group.value_col === this.config.color_by).label;
    } else {
        delete this.config.color_dom;
        delete this.config.legend.order;
        this.config.legend.label = 'All Participants';
    }
}
