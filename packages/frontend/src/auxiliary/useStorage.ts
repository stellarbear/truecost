import {useEffect, useState} from "react";
import {SafeJSON} from "auxiliary/json";

export const useStorage = <T>(key: string, base: T, validate: (input: T) => T = (input) => input): [T, (input: T) => void] => {
    const [storage, setStorage] = useState<T>(base)

    useEffect(() => {
        const json = localStorage.getItem(key);
        const data = SafeJSON.parse(json, base);
        setStorage(validate(data));
    }, [])

    const updateStorage = (data: T) => {
        localStorage.setItem(key, JSON.stringify(data))
        setStorage(data);
    }

    return [storage, updateStorage];
}