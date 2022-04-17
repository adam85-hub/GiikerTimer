export default function roundTo(decimalPlaces, number) {
    return Math.round((number + Number.EPSILON) * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
}
