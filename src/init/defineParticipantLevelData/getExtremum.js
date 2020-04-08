export default function getExtremum(visitWindows, extremum, variable) {
    return visitWindows.length
        ? d3[extremum](visitWindows, visitWindow => visitWindow[variable])
        : null;
}
