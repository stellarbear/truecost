import {useEffect, useState} from "react";

type Event<T> = (value: T) => void;

export const useDebounceState = <T>(value: T, event: Event<T>, lag = 1000) => {
    const [timerID, setTimerID] = useState<NodeJS.Timeout>();
    const [state, setState] = useState(value);
    useEffect(() => setState(value), [value]);

    const bubbleState = (value: T) => {
        setState(value);

        if (timerID) {
            global.clearTimeout(timerID);
            setTimerID(undefined);
        }

        const timer = global.setTimeout(() => {
            event(value);
        }, lag);
        setTimerID(timer);
    };

    return {
        state,
        bubbleState,
    };
};
