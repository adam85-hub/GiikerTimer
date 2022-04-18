import React, { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

const RotatingView = (props) => {
    let pstyle;
    if (!props.style) pstyle = [{}];
    else pstyle = [props.style];

    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 100,
                duration: 10000,
                useNativeDriver: true,
                easing: Easing.linear
            })).start();
    }, [rotateAnim])

    return (
        <Animated.View style={[...pstyle, {
            transform: [{
                rotateZ: rotateAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0deg', '360deg']
                })
            }]
        }]}>
            {props.children}
        </Animated.View>
    )
} 

export default RotatingView;
