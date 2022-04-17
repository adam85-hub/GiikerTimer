import React from 'react';

import {
    Text,
    StyleSheet,
    View
} from 'react-native';

const BottomBar = (props) => {    

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Avg5: 28.7</Text>
            <Text style={styles.text}>TPS: {props.tps}</Text>
            <Text style={styles.text}>Avg12: 30.1</Text>
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
        justifyContent: "space-between"
    },
    text: {
        fontSize: 20
    }
});

export default BottomBar;
