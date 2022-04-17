import React, {useEffect, useRef} from 'react';

import {
    Text,
    StyleSheet,
    ScrollView
} from 'react-native';

import formatTime from './Helpers/formatTime';

const TimesTable = (props) => {    
    if (props.times === undefined || props.times.length === 0) return null;
    let svRef = useRef(null);
    let times = [];
    let bestIndex = 0;

    for (let i = 0; i < props.times.length; i++) {
        if (props.times[i].time < props.times[bestIndex].time) bestIndex = i;

        times.push({
            index: i+1,
            time: props.times[i].time,
            tps: props.times[i].tps,
            isBest: false
        });
    }

    times[bestIndex].isBest = true;
    
    useEffect(() => {
        if (!svRef.current) return;
        
        svRef.current.scrollToEnd();
    })

    return (
        <ScrollView style={styles.container} ref={svRef}>            
            {times.map((time, index) => <SingleTime time={time} key={index}></SingleTime>)}
        </ScrollView>
    )
}

function SingleTime(props) {
    return (
        <Text style={[styles.timeText, props.time.isBest ? styles.bestTime : null]}>
            {props.time.index + ") " + formatTime(props.time.time) + " tps: " + props.time.tps}
        </Text>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 5,
        top: 0,
        zIndex: 2137,
        height: "85%",
    },
    timeText: {
        fontSize: 20,
        color: "black"
    },
    bestTime: {
        color: "green"
    }
});

export default TimesTable;
