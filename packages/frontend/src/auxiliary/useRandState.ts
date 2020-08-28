import {useState} from "react";

const alphabet = "23456789ABCDEFGHKMNPQRSTUVWXYZ";

export function generateCode(length: number, prefix = ""): string {
    let result = prefix;

    for (let i = 0; i < length; i++) {
        const index = Math.round((alphabet.length - 1) * Math.random());
        result += alphabet[index];
    }

    return result;
}

export const useRandState = (length: number): [string] => {
    const [state] = useState<string>(generateCode(length));

    return [state];
};