export default function highlightPoint() {
    this.marks
        .find(mark => mark.type === 'circle')
        .circles.classed('wc-selected', d => d.key === this.nepExplorer.participant);
}
