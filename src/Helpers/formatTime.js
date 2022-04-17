export default function formatTime(time) {
    let sec = time;

    let min = Math.floor(sec / 60);
    sec = sec - (min * 60);
    sec = Math.round((sec + Number.EPSILON) * 10) / 10;

    if (sec % 1 === 0) sec = sec + ".0";
    if (min < 10) min = "0" + min;
    if (sec < 10) sec = "0" + sec;

    return `${min}:${sec}`;
}
