import * as React from "react";
import {ABase, Component, IBase, IRender} from "./ABase";
import {InputField} from "components";

export interface IString extends IBase {
    multiline?: boolean;
    editable?: boolean;
}

export class CString extends ABase implements IString {
    editable: boolean;
    multiline: boolean;

    constructor({multiline = false, editable = true, ...rest}: IString) {
        super(rest);

        this.editable = editable;
        this.multiline = multiline;
    }

    renderAddComponent = (params: IRender, type: Component): JSX.Element => this.asTextField({...params}, type);
    renderListComponent = (params: IRender, type: Component): JSX.Element => this.asTextField({...params}, type);
    renderFilterComponent = (params: IRender, type: Component): JSX.Element => this.asTextField({...params}, type);

    asTextField({value, onChange}: IRender, type: Component) {
        const {label, editable, multiline} = this;
        const overrideStringValue = value == null ? "" : value;

        return (
            <InputField
                multiline={multiline}
                rowsMax={multiline ? "4" : "1"}
                inputStyle={{minWidth: 200, marginTop: 0}}
                editable={type === Component.Filter ? true : editable}
                label={label}
                value={overrideStringValue}
                onChangeEvent={(eventValue: string) => {
                    //const stateValue = eventValue == "" ? null : eventValue;
                    onChange(eventValue);
                }}/>
        );
    }
}
