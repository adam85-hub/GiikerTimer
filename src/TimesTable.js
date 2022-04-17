import React from 'react';

import {
    Text,
    StyleSheet,
    View
} from 'react-native';

import formatTime from './Helpers/formatTime';

const TimesTable = (props) => {
    if (props.times === undefined || props.times.length === 0) return null;
    let times = [];
    let bestIndex = 0;

    for (let i = 0; i < props.times.length; i++) {
        if (props.times[i] < props.times[bestIndex]) bestIndex = i;

        times.push({
            index: i+1,
            time: props.times[i],
            isBest: false
        });
    }

    times[bestIndex].isBest = true;

    return (
        <View style={styles.container}>
            {times.map((time, index) => <SingleTime time={time} key={index}></SingleTime>)}
        </View>
    )
}

function SingleTime(props) {
    return (
        <Text style={[styles.timeText, props.time.isBest ? styles.bestTime : null]}>{props.time.index + ") " + formatTime(props.time.time)}</Text>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 5,
        top: 0,
        zIndex: 2137,
    },
    timeText: {
        fontSize: 17,
        color: "black"
    },
    bestTime: {
        color: "green"
    }
});

export default TimesTable;
