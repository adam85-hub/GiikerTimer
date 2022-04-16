import React from 'react';

import {
    Text,
    StyleSheet,
} from 'react-native';

const Timer = (props) => {
    let sec = props.time;    //todo: Change this to formatTime function

    let min = Math.floor(sec / 60);
    sec = sec - (min * 60);
    sec = Math.round((sec + Number.EPSILON) * 10) / 10;

    if (sec % 1 === 0) sec = sec + ".0";
    if (min < 10) min = "0" + min;
    // if (sec < 10 && sec >= 1) sec = "0" + sec;

    return (
        <Text style={[styles.timerText, props.running ? styles.timerRunning : undefined]}>{min > 0 ? min + ":" : ""}{sec}</Text>
    );
}

const styles = StyleSheet.create({
    timerText: {
        fontSize: 90,
        color: "gray"
    },
    timerRunning: {
        color: "black"
    },
});

export default Timer;
