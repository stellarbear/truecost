import React, {useEffect, useState} from "react";
import {TextField} from "@material-ui/core";
import {BaseTextFieldProps} from "@material-ui/core/TextField";

interface MaskedInputFieldProps extends BaseTextFieldProps {
    mask: any[];
    value: string;
    editable?: boolean;
    separator?: string;
    onChangeEvent: ((value: string) => void);
}

const InputMaskedField = ({
                              mask,
                              value,
                              editable,
                              onChangeEvent,
                              separator = "_",
                              ...rest
                          }: MaskedInputFieldProps): JSX.Element => {
    const validMask = mask
        .filter(e => ["String", "RegExp"].includes(e.constructor.name))
        .reduce((obj, cur) => cur.constructor.name == "String" ? obj.concat((cur as string).split("")) : [...obj, cur], []) as any[];
    const inputMask = validMask
        .map((e, i: number) => e.constructor.name == "RegExp" ? i : undefined)
        .filter(x => x) as number[];

    let valueHelperIndex = 0;
    const defaultMask = validMask
        .map((v, i) => inputMask.includes(i) ? value.charAt(valueHelperIndex++) || separator : v);

    const [chars, setChars] = useState(defaultMask);

    const [lastIndex, setLastIndex] = useState(validMask.length - 1);
    const [pointer, setPointer] = useState(value.length);
    const input = React.useRef<HTMLInputElement>(null);

    if (defaultMask.join("") !== chars.join("")) {
        setChars(defaultMask);
        setPointer(value.length);
        setLastIndex(validMask.length - 1);
    }
    useEffect(() => {
        if (input) {
            const current: any = (input as any).current;
            current.value = chars.join("");
            current.selectionStart = current.selectionEnd = pointer < inputMask.length ? inputMask[pointer] : validMask.length;
        }
    }, [chars]);

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const DELETE = 46;
        const BACKSPACE = 8;
        const LEFT = 37;
        const RIGHT = 39;
        const char = event.key;
        const keyCode = event.keyCode;
        const cursor = (event.target as any).selectionStart;

        let cursorPointer = inputMask.findIndex(e => e >= cursor);
        cursorPointer = cursorPointer == -1 ? inputMask[inputMask.length - 1] : cursorPointer;
        const currentIndex = pointer > cursorPointer ? cursorPointer : pointer;

        const insertIndex = inputMask[currentIndex];

        let newPointer = currentIndex;
        const newChars = [...chars];

        if (cursor < validMask.length || currentIndex < inputMask.length) {
            if (![LEFT, RIGHT].includes(keyCode)) {
                inputMask.forEach(index => {
                    if (index < insertIndex) {
                        // skip
                    } else if (index == insertIndex) {
                        if (validMask[index].test(char)) {
                            newPointer++;
                            setLastIndex(index);
                            newChars[index] = char;
                        } else {
                            newChars[index] = separator;
                        }
                    } else {
                        newChars[index] = separator;
                    }
                });
            }
            if (keyCode == DELETE) {
                inputMask.forEach(index => {
                    if (index <= newPointer) {
                        // skip
                    } else {
                        newChars[inputMask[index]] = separator;
                    }
                });
            }
        }
        if (keyCode == BACKSPACE) {
            if (newPointer > 0) {
                newChars[inputMask[newPointer - 1]] = separator;
                newPointer--;
            }
        }

        if (keyCode == RIGHT) {
            if (inputMask[newPointer] <= lastIndex) {
                newPointer++;
            }
        }
        if (keyCode == LEFT) {
            newPointer--;
        }

        newPointer = newPointer < 0 ? 0 : newPointer;
        newPointer = newPointer < inputMask.length ? newPointer : inputMask.length;

        setChars(newChars);
        setPointer(newPointer);
        onChangeEvent(newChars.filter((c, i) => inputMask.includes(i)).filter(c => c != separator).join(""));
    };

    const onTextChange = () => {
        setChars([...chars]);
    };

    return (
        <TextField
            {...rest}
            disabled={editable}
            inputRef={input}
            fullWidth
            value={chars.join("")}
            variant="filled"
            onChange={() => onTextChange()}
            onKeyDown={onKeyDown}
        />

    );
};

export default InputMaskedField;
