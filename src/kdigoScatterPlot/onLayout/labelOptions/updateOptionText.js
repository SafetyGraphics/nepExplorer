export default function updateOptionText(options, callback) {
    const chart = this;

    options.each(function(d) {
        const option = d3.select(this);
        option.attr('value', d);
        const optionText = callback(d);
        option.text(optionText);
    });
}
