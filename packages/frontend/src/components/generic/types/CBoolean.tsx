import * as React from "react";
import {ABase, IRender, ICtor} from "./ABase";
import {isUndefined} from "@truecost/shared";
import {BooleanSelectField} from "../components/BooleanSelectField";
import SwitchField from "../components/SwitchField";

export interface IBoolean extends ICtor<boolean> {
    textTrue: string;
    textFalse: string;
}

export class CBoolean extends ABase<boolean> {
    textTrue: string;
    textFalse: string;

    constructor({textTrue, textFalse, base = false, ...rest}: IBoolean) {
        super({...rest, base});
        this.textTrue = textTrue;
        this.textFalse = textFalse;
    }

    renderAddImplementation = this.asSwitch;
    renderFilterlementation = this.asSelect;
    renderListlementation = this.asSwitch;

    asSelect({value, onChange}: IRender<boolean>) {
        const {label, base} = this.data;
        const {textTrue, textFalse} = this;

        return (
            <BooleanSelectField
                label={label}
                value={value || base!}
                onChangeEvent={onChange}
            />
        );
    }

    asSwitch({value, onChange}: IRender<boolean>) {
        const {label, base} = this.data;
        const {textTrue, textFalse} = this;

        return (
            <SwitchField
                value={value || base!}
                prefix={textFalse}
                suffix={textTrue}
                onChangeEvent={onChange}
            />
        );
    }
}
