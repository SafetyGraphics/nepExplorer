export default function updatePopCount() {
    this.nepExplorer.data.filtered = this.nepExplorer.data.participants;
    this.filters.forEach(filter => {
        this.nepExplorer.data.filtered = this.nepExplorer.data.filtered.filter(d =>
            Array.isArray(filter.val)
                ? filter.val.includes(d[filter.col])
                : filter.val === d[filter.col]
        );
    });
    this.controls.popCount.html(
        `<span class = 'numerator'>${this.nepExplorer.data.filtered.length}</span> of <span class = 'numerator'>${this.nepExplorer.data.participants.length}</span> participants selected.`
    );
}
