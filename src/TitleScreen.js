import React from 'react';

import {
    Text,
    StyleSheet,
    View,
    Pressable,
} from 'react-native';

import Rubik3d from "./Assets/Rubik3d";
import Rubik2d from './Assets/Rubik2d';
import RotatingView from "./Helpers/RotatingView";

const TitleScreen = (props) => {
    return (
        <Pressable style={styles.container}>
            <RotatingView style={styles.rubikCube}>
                <Rubik2d/>
            </RotatingView>
            <Text style={[styles.text, styles.title]}>GiiKER Timer</Text>
            <Text style={[styles.text, styles.author]}>Adam Bialik 2022</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: "#363636"
    },
    text: {
        color: "white"
    },
    title: {
        textAlign: "center",
        fontSize: 70
    },
    author: {
        textAlign: "center",
        fontSize: 35
    },
    rubikCube: {
        width: 90,
        height: 90,
        alignSelf: "center",
        marginBottom: 20,
    }
})

export default TitleScreen;
