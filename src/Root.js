import React, { useEffect } from 'react';
import {
    View,
    StyleSheet,
    Pressable,
    Alert
} from 'react-native';

import { BleManager } from 'react-native-ble-plx';
import Giiker from 'react-native-giiker';

import Timer from './Timer';
import useTimer from './Hooks/useTimer';

const Root = () => {
    const timer = useTimer();
    const bleManager = new BleManager();
    let giiker;

    useEffect(() => {
        const sub = bleManager.onStateChange((state) => {
            if (state == "PoweredOn") {
                scanAndConnect();
            }
        }, true);

        return () => {
            sub.remove();
        }
    }, [])

    function scanAndConnect() {
        bleManager.startDeviceScan(null, null, async (error, device) => {
            if (error) {
                console.warn(error);
                return;
            }
            if (device.name != null) {
                console.log(device.name)
                // Connect to first device found
                if (device.name.match("^Gi")) {
                    bleManager.stopDeviceScan();
                    giiker = new Giiker(device);
     
                    await giiker.connect();     
                    setupCubeEvents();
                }
            }
        })
    }

    function setupCubeEvents() {
        // Events
        giiker.on("connected", () => {
            Alert.alert("Success!", "Successfully connected to GiiKER cube");
        });
        giiker.on("disconnected", () => {
            console.log("Giiker disconnected!");
        });
        giiker.on("move", (move) => {
            console.log(move);
            console.log(giiker.stateString);
        });
        giiker.on("battery", (battery) => {
            console.log(battery);
        });
        giiker.on("move count", (count) => {
            console.log(count);
        });
        giiker.on("update state", () => {
            console.log(giiker.stateString);
        });
    }

    const onPressIn = () => {
        if (timer.isRunning === false) {
            timer.reset();
            timer.start();
        }
        else timer.stop();
    }

    return (
        <Pressable onPressIn={onPressIn}>
            <View style={styles.container}>
                <Timer running={timer.isRunning} time={timer.time}></Timer>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%"
    }
});

export default Root;
