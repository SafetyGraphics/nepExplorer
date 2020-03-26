import groupControls from './onLayout/groupControls';
import labelOptions from './onLayout/labelOptions';

export default function onLayout() {
    groupControls.call(this);
    labelOptions.call(this);
}
