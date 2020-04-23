export default function disableVisitWindowInput() {
    this.controls.visit_window.selectAll('input').property('disabled', this.config.visit_comparison !== 'visit_window');
}
