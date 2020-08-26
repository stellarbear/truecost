import {useState, useEffect} from "react";

type Event<T> = (value: T) => void

export const useDebounceState = <T>(value: T, event: Event<T>, lag = 1000) => {
    const [timerID, setTimerID] = useState<NodeJS.Timeout>();
    const [state, setState] = useState(value);
    useEffect(() => setState(value), [value]);

    const bubbleState = (value: T) => {
        setState(value);

        if (timerID) {
            global.clearInterval(timerID);
            setTimerID(undefined);
        }

        const timer = global.setInterval(() => {
            event(value);
        }, lag);
        setTimerID(timer);
    }

    return {
        state,
        bubbleState,
    }
}