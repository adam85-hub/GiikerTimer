import { useState, useEffect } from "react";

export default function useTimer() {
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0);

    useEffect(() => {
        let interval = null;

        if (isRunning === true) {
            interval = setInterval(() => {
                setTime(prev => prev + 0.1);
            }, 100)
        }
        else {
            clearInterval(interval);
        }

        return () => {
            clearInterval(interval);
        }
    }, [isRunning]);

    const start = () => {
        if (isRunning === true) throw Error("Timer is already running");
        setIsRunning(true);
    }

    const stop = () => {
        if (isRunning === false) throw Error("Timer is already stopped");
        setIsRunning(false);
    }

    const reset = () => {
        setTime(0);
    }

    return { start, stop, reset, time, isRunning };
}
