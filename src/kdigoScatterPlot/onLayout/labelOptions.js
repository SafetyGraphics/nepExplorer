import updateOptionText from './labelOptions/updateOptionText';
import addChangeEventListener from './labelOptions/addChangeEventListener';

export default function labelOptions() {
    const chart = this;

    this.controls.settings.each(function(d) {
        if (d.type === 'dropdown') {
            const controlGroup = d3.select(this);
            const select = controlGroup.selectAll('select');
            const options = select.selectAll('option');
            switch (d.label) {
                case 'X-axis':
                    updateOptionText.call(chart, options, function(text) {
                        const result = text.substring(text.search(/_.?chg/) + 1);
                        const measure = chart.config.measure_values[text.replace(`_${result}`, '')];
                        return `${measure} ${result
                            .replace(/^chg$/, 'Change')
                            .replace(/^pchg$/, 'Percent Increase')
                            .replace(/^pchg_inv$/, 'Percent Decrease')}`;
                    });
                    addChangeEventListener.call(chart, select);
                    break;
                case 'Y-axis':
                    updateOptionText.call(chart, options, function(text) {
                        const result = text.substring(text.search(/_.?chg/) + 1);
                        const measure = chart.config.measure_values[text.replace(`_${result}`, '')];
                        return `${measure} ${result
                            .replace(/^chg$/, 'Change')
                            .replace(/^pchg$/, 'Percent Increase')
                            .replace(/^pchg_inv$/, 'Percent Decrease')}`;
                    });
                    addChangeEventListener.call(chart, select);
                    break;
                case 'Group':
                    updateOptionText.call(chart, options, function(text) {
                        return text !== 'None'
                            ? chart.config.groups.find(group => group.value_col === text).label
                            : 'None';
                    });
                    addChangeEventListener.call(chart, select);
                    break;
                default:
                    //console.log(d);
                    break;
            }
        }
    });
}
