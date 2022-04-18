import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Pressable,
    Text
} from 'react-native';

import { Subject } from 'rxjs';
import { BleManager } from 'react-native-ble-plx';
import Giiker from 'react-native-giiker';

//* Components
import Timer from './Timer';
import useTimer from './Hooks/useTimer';
import TimesTable from './TimesTable';
import BottomBar from './BottomBar';

//* Helper functions
import roundTo from './Helpers/roundTo';
import generateMockTimes from './Helpers/generateMockTimes';

const solvedState = "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB";
const bleManager = new BleManager();
let giiker;

const HomeScreen = () => {
    const timer = useTimer();
    const [cubeConnected, setCubeConnected] = useState(false);
    const [isSolved, setIsSolved] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [onMove, setOnMove] = useState(new Subject());
    const [moveCount, setMoveCount] = useState(0);
    const [tps, setTps] = useState(0);
    const [times, setTimes] = useState([]); 
    
    
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
        if (isReady == false) return;

        const sub = onMove.subscribe(() => {
            if (isReady === true) {
                timer.start();
                setMoveCount(0);
                setIsReady(false);
            }
        })

        return () => {
            sub.unsubscribe();
            sub.remove();
        }
    }, [isReady])
    
    useEffect(() => {
        if (timer.isRunning === true && isSolved === true) {
            const newTime = {
                time: roundTo(1, timer.time),
                tps: tps
            }

            setTimes(prev => [...prev, newTime]);
            timer.stop();
            timer.reset();
        }
    }, [isSolved])

    useEffect(() => {
        if (timer.isRunning == false) return;
        if (timer.time === 0) {
            setTps(0);
            return;
        }

        setTps(roundTo(1, moveCount / timer.time));
    }, [moveCount])

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
     
                    setupCubeEvents();
                    await giiker.connect();     
                    bleManager.stopDeviceScan();
                }
            }
        })
    }

    function setupCubeEvents() {
        // Events
        giiker.on("connected", () => {
            console.log("Giiker connected!");
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
            setMoveCount(prev => prev + 1);
            setIsSolved(solvedState === giiker.stateString);         
        });
        giiker.on("battery", (battery) => {
            console.log(battery);
        }); 
    }

    const onPressIn = () => {
        if (isSolved === false && cubeConnected === true && timer.isRunning === false) {
            setIsReady(true);    
        }
    }

    return (
        <View>
            <Text style={styles.author}>Adam Bialik 2022</Text>
            <Pressable onPressIn={onPressIn}>
                <View style={styles.container}>
                    {cubeConnected && (timer.isRunning || isReady == true) ?
                        <Timer running={timer.isRunning} time={timer.time}></Timer>
                        :
                        <Text style={styles.infoText}>{cubeConnected == false ? "Łączenie z kostką..." : isSolved ? "Pomieszaj kostkę" : "Gotowy?"}</Text>
                    }                
                </View>
                <BottomBar tps={tps} times={times}></BottomBar>
            </Pressable>
            <TimesTable times={times} onClear={() => setTimes([])}></TimesTable>
        </View>
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
    },
    author: {
        position: "absolute",
        right: 0,
        top: 0
    },
});

export default HomeScreen;
