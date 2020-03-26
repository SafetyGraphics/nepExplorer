export default function updatePopCount() {
    this.controls.popCount.html(
        `<span class = 'numerator'>${this.filtered_data.length}</span> of <span class = 'numerator'>${this.nepExplorer.data.participants.length}</span> participants shown.`
    );
}
