import React, {useEffect, useRef} from 'react';

import {
    Text,
    StyleSheet,
    ScrollView,
    View,
    Pressable
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
        <View style={styles.container}>            
            <ScrollView style={styles.scrollView} ref={svRef}>            
                {times.map((time, index) => <SingleTime time={time} key={index}></SingleTime>)}
            </ScrollView>
            <Pressable style={styles.clearBtn} onPressIn={props.onClear}>
                <Text style={styles.btnText}>Wyczyść</Text>
            </Pressable>
        </View>
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
        right: "1.5%",
        top: "2%",
        zIndex: 2137,
        height: "82%",
        justifyContent: "space-between"
    },
    clearBtn: {
        width: "100%",
        backgroundColor: "#e0e0e0",
        alignContent: "center",
        justifyContent: "center",       
        marginBottom: 5,
        paddingVertical: 7,
        marginTop: 5
    },
    btnText: {
        textAlign: "center",
        fontSize: 15,
        fontWeight: "bold"
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
