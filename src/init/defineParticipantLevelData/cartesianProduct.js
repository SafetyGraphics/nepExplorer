// https://stackoverflow.com/a/43053803
export default function cartesianProduct(a, b, ...c) {
    const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
    return b ? cartesianProduct(f(a, b), ...c) : a;

    return cartesian;
}
