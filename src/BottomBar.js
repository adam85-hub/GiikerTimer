import React from 'react';

import {
    Text,
    StyleSheet,
    View
} from 'react-native';
import roundTo from './Helpers/roundTo';

const BottomBar = (props) => {  
    let ao5 = 0;
    let ao12 = 0;

    if (props.times.length >= 5) {
        const times = props.times.slice(props.times.length - 5);
        for (let { time } of times) {
            ao5 += time;
        }
        ao5 = ao5 / 5;
    }

    if (props.times.length >= 12) {
        const times = props.times.slice(props.times.length - 12);
        for (let { time } of times) {
            ao12 += time;
        }
        ao12 = ao12 / 12;
    }
    
    ao5 = roundTo(2, ao5);
    ao12 = roundTo(2, ao12);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Ao5: {ao5 === 0 ? "###" : ao5}</Text>
            <Text style={styles.text}>TPS: {props.tps}</Text>
            <Text style={styles.text}>Ao12: {ao12 === 0 ? "###" : ao12}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",        
        flexDirection: "row",
        alignItems: 'center',
        bottom: 0,
        left: 0,
        padding: 10,
        height: "15%",
        width: "100%",
        backgroundColor: "#eee",
        justifyContent: 'space-between'
    },
    text: {
        fontSize: 20
    }
});

export default BottomBar;
