export default function addChangeEventListener(select) {
    const chart = this;

    select.on('change', function(d) {
        const value = select.selectAll('option:checked').attr('value');

        if (Array.isArray(d.options)) {
            d.options.forEach(option =>
                chart.controls.stringAccessor(chart.config, option, this.value)
            );
        } else {
            chart.controls.stringAccessor(chart.config, d.option, this.value);
        }

        chart.draw();
    });
}
