import * as React from "react";
import {ABase, IRender, ICtor} from "./ABase";
import {isUndefined} from "@truecost/shared";
import {BooleanSelectField} from "../components/BooleanSelectField";
import SwitchField from "../components/SwitchField";
import {InputField} from "../components/InputField";

export interface IString extends ICtor<string> {
    multiline?: boolean;
    editable?: boolean;
}


export class CString extends ABase<string> {
    editable: boolean;
    multiline: boolean;

    constructor({multiline = false, editable = true, base = '', ...rest}: IString) {
        super({...rest, base});
        this.editable = editable;
        this.multiline = multiline;
    }

    renderAddImplementation = this.InputField;
    renderFilterlementation = this.InputField;
    renderListlementation = this.InputField;

    InputField({value, onChange}: IRender<string>) {
        const {label, base} = this.data;
        const {editable, multiline} = this;

        return (
            <InputField
                multiline={multiline}
                rowsMax={multiline ? "4" : "1"}
                editable={editable}
                label={label}
                value={value || base!}
                onChangeEvent={onChange}/>
        );
    }
}
