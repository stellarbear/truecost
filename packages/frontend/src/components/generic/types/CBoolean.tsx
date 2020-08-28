import * as React from "react";
import {ABase, ICtor, IRender} from "./ABase";
import {BooleanSelectField} from "../components/BooleanSelectField";
import SwitchField from "../components/SwitchField";

export interface IBoolean extends ICtor<boolean> {
    textTrue: string;
    textFalse: string;
}

export class CBoolean extends ABase<boolean> {
    textTrue: string;
    textFalse: string;
    renderAddImplementation = this.asSwitch;
    renderFilterlementation = this.asSelect;
    renderListlementation = this.asSwitch;

    constructor({textTrue, textFalse, base = false, ...rest}: IBoolean) {
        super({...rest, base});
        this.textTrue = textTrue;
        this.textFalse = textFalse;
    }

    asSelect({value, onChange}: IRender<boolean>) {
        const {label} = this.data;

        return (
            <BooleanSelectField
                label={label}
                value={value}
                onChangeEvent={onChange}
            />
        );
    }

    asSwitch({value, onChange}: IRender<boolean>) {
        const {textTrue, textFalse} = this;

        return (
            <SwitchField
                value={value}
                prefix={textFalse}
                suffix={textTrue}
                onChangeEvent={onChange}
            />
        );
    }
}
