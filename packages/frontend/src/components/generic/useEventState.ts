import {useState, useEffect} from "react";

type Event<T> = (value: T) => void

export enum state {local, }

export const useEventState = <T>(value: T, event: Event<T>) => {
    const [state, setState] = useState(value);
    useEffect(() => setState(value), [value]);

    const bubbleState = () => event(state);
    const bubbleStateArg = (value: T) => event(value);

    const setAndBubbleState = (value: T) => {
        setState(value);
        bubbleStateArg(value);
    }

    return {
        state,
        setState,
        bubbleState,
        setAndBubbleState
    }
}