import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Pressable,
    Alert,
    Text
} from 'react-native';

import { BleManager } from 'react-native-ble-plx';
import Giiker from 'react-native-giiker';

import Timer from './Timer';
import useTimer from './Hooks/useTimer';

const solvedState = "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB";

const Root = () => {
    const timer = useTimer();
    const [cubeConnected, setCubeConnected] = useState(false);

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
            Alert.alert("Sukces!", "Połączono z kostką GiiKER");
            setCubeConnected(true);
        });
        giiker.on("disconnected", () => {
            console.log("Giiker disconnected!");
            setCubeConnected(false);
        });

        giiker.on("move", (move) => {
            console.log(giiker.stateString);
        });
        giiker.on("battery", (battery) => {
            console.log(battery);
        });
        giiker.on("move count", (count) => {
            console.log(count);
        });
    }

    const onPressIn = () => {
        if (timer.isRunning === true) {
            timer.stop();
        }
    }

    return (
        <Pressable onPressIn={onPressIn}>
            <View style={styles.container}>
                {cubeConnected ?
                    <Timer running={timer.isRunning} time={timer.time}></Timer>
                    :
                    <Text style={styles.connectingText}>Łączenie z kostką...</Text>
                }                
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
    },
    connectingText: {
        fontSize: 40
    }
});

export default Root;
