import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Pressable,
    Alert,
    Text
} from 'react-native';

import { Subject } from 'rxjs';
import { BleManager } from 'react-native-ble-plx';
import Giiker from 'react-native-giiker';

import Timer from './Timer';
import useTimer from './Hooks/useTimer';
import TimesTable from './TimesTable';

const solvedState = "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB";

const Root = () => {
    const timer = useTimer();
    const [cubeConnected, setCubeConnected] = useState(false);
    const [isSolved, setIsSolved] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [onMove, setOnMove] = useState(new Subject());

    const [times, setTimes] = useState([]);

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

    useEffect(() => {
        if (isReady === false) return;

        const sub = onMove.subscribe(() => {
            if (isReady === true) {
                timer.start();
                setIsReady(false);
            }
        })

        return () => {
            sub.unsubscribe();
        }
    }, [isReady])
    
    useEffect(() => {
        if (timer.isRunning === true && isSolved === true) {
            setTimes(prev => [...prev, Math.round((timer.time + Number.EPSILON) * 10) / 10]);
            timer.stop();
            timer.reset();
        }
    }, [isSolved])

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
            setIsSolved(solvedState === giiker.stateString);   
        });
        giiker.on("disconnected", () => {
            console.log("Giiker disconnected!");
            setCubeConnected(false);
        });

        giiker.on("move", (move) => {
            // console.log(giiker.stateString);

            onMove.next("move");            

            setIsSolved(solvedState === giiker.stateString);         
        });
        giiker.on("battery", (battery) => {
            console.log(battery);
        });
        giiker.on("move count", (count) => {
            console.log(count);
        });
    }

    const onPressIn = () => {
        if (isSolved === false && cubeConnected === true && timer.isRunning === false) {
            setIsReady(true);    
        }
    }

    return (
        <Pressable onPressIn={onPressIn}>
            <View style={styles.container}>
                {cubeConnected && (timer.isRunning || isReady == true) ?
                    <Timer running={timer.isRunning} time={timer.time}></Timer>
                    :
                    <Text style={styles.infoText}>{cubeConnected == false ? "Łączenie z kostką..." : isSolved ? "Pomieszaj kostkę" : "Gotowy?"}</Text>
                }                
            </View>
            <TimesTable times={times}></TimesTable>
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
    infoText: {
        fontSize: 40
    }
});

export default Root;
