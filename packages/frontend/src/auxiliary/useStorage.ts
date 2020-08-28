import {useState} from "react";
import {SafeJSON} from "auxiliary/json";

export const useStorage = <T>(
    key: string,
    base: T,
    validate: (input: T) => T = (input) => input,
): [T, (input: T) => void] => {
    const [storage, setStorage] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return base;
        }

        const json = localStorage.getItem(key);
        const data = SafeJSON.parse(json, base);
        const validated = validate(data);

        return validated;
    });

    const updateStorage = (data: T) => {
        localStorage.setItem(key, JSON.stringify(data));
        setStorage(data);
    };

    return [storage, updateStorage];
};