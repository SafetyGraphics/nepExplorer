export default function updateDomains() {
    this.x_dom[0] = Math.min(this.x_dom[0], this.config.y.type === 'log' ? 1 : 0);
    this.x_dom[1] = Math.max(this.x_dom[1], d3.max(this.config.criteria, criterion => criterion.x));
    this.y_dom[0] = Math.min(this.y_dom[0], this.config.y.type === 'log' ? 1 : 0);
    this.y_dom[1] = Math.max(this.y_dom[1], d3.max(this.config.criteria, criterion => criterion.y));
}
