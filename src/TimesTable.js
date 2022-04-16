import React from 'react';

import {
    Text,
    StyleSheet,
    View
} from 'react-native';

const TimesTable = (props) => {
    if (props.times === undefined || props.times.length === 0) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Czasy: </Text>
            {props.times.map((time, index) => <Text key={index} style={[styles.text, styles.timeText]}>{time}</Text>)}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 2137,
    },
    text: {
        fontSize: 20,
        color: "black"
    },
    timeText: {
        fontSize: 17
    }
});

export default TimesTable;
