export default function round(value) {
    const float = parseFloat(value);
    if (float === NaN) return NaN;

    const int = parseInt(value);
    if (float === int) return int;

    return float < 1
        ? Math.round(float * 1000) / 1000
        : float < 10
        ? Math.round(float * 100) / 100
        : float < 100
        ? Math.round(float * 10) / 10
        : Math.round(float);
}
