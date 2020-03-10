export default function drawKdigoStages() {
    this.svg.selectAll('.kdigo-stages').remove();

    //this.svg.append('rect')
    //    .attr('x', 0)
    //    .attr('y', this.plot_height - this.plot_height)
    //    .attr('width', this.plot_width)
    //    .attr('height', this.plot_height)
    //    .attr('fill', 'red');
    //this.svg.append('rect')
    //    .attr('x', 0)
    //    .attr('y', this.plot_height - this.plot_height/2)
    //    .attr('width', this.plot_width/2)
    //    .attr('height', this.plot_height/2)
    //    .attr('fill', 'orange');
    //this.svg.append('rect')
    //    .attr('x', 0)
    //    .attr('y', this.plot_height - this.plot_height/3)
    //    .attr('width', this.plot_width/3)
    //    .attr('height', this.plot_height/3)
    //    .attr('fill', 'yellow');
    //this.svg.append('rect')
    //    .attr('x', 0)
    //    .attr('y', this.plot_height - this.plot_height/4)
    //    .attr('width', this.plot_width/4)
    //    .attr('height', this.plot_height/4)
    //    .attr('fill', 'white');

    const kdigo_criteria = Object.keys(this.config.kdigo_criteria)
        .map(key => this.config.kdigo_criteria[key]);

    kdigo_criteria.unshift({
        creat_fchg: 1,
        egfr_creat_fchg: 0,
        color: 'white',
    });

    kdigo_criteria.push({
        creat_fchg: this.x_dom[1],
        egfr_creat_fchg: this.y_dom[1],
        color: this.config.kdigo_criteria.stage_3.color,
    });

    console.table(kdigo_criteria);

    //const d = kdigo_criteria[2];
    //console.log(this.y(d.egfr_creat_fchg));
    //this.svg.append('rect')
    //    .attr('x', 0)
    //    .attr('y', this.y(d.egfr_creat_fchg))
    //    .attr('width', this.x(d.creat_fchg))
    //    .attr('height', this.plot_height - this.y(d.egfr_creat_fchg))
    //    .attr('fill', d.color);

    //const kdigo_pairs = d3.pairs(kdigo_criteria.reverse());

    //kdigo_pairs.forEach(d => {
    //    d.x = 0; // x starts at the left side of the chart
    //    d.y = this.plot_height - this.y(d[1].egfr_creat_fchg);
    //    d.width = this.x(d[0].creat_fchg) - d.x;
    //    d.height = this.y(d[1].egfr_creat_fchg);
    //    d.fill = d[1].color;
    //    console.log(d);
    //});

    const kdigoStages = this.svg
        .insert('g', '.overlay')
        .classed('kdigo-stages', true);

    kdigoStages
        .selectAll('rect.kdigo-stage')
        .data(kdigo_criteria.reverse())
        .enter()
        .append('rect')
        .classed('kdigo-stage', true)
        .attr({
            x: d => 0,
            y: d => this.y(d.egfr_creat_fchg),
            width: d => this.x(d.creat_fchg),
            height: d => this.plot_height - this.y(d.egfr_creat_fchg),
            fill: d => d.color,
        });
}
