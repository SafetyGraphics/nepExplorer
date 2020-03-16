export default function merge(value, replacement) {
    if (value === undefined) return replacement;

    if (replacement === undefined) return value;

    if (typeof value !== typeof replacement) {
        console.warn(
            `Type difference in merge():\nValue: [ ${JSON.stringify(
                value
            )} ]\nReplacement: [ ${JSON.stringify(replacement)} ]`
        );
        return value || replacement;
    }

    if (typeof replacement !== 'object') return replacement;

    if (Array.isArray(value)) {
        const array = [];

        for (let i = 0; i < Math.max(value.length, replacement.length); i++) {
            array[i] = merge(value[i], replacement[i]);
        }

        return array;
    }

    const obj = {};
    for (const property of [...Object.keys(value), ...Object.keys(replacement)])
        obj[property] = merge(value[property], replacement[property]);

    return obj;
}
