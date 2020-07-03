import React from "react";
import {ABase, Component, IBase, IRender} from "./ABase";
import {InputField, InputMaskedField, PasswordField} from "components";

export interface IString extends IBase {
    component?: React.ReactNode;
    hideInput?: boolean;
    multiline?: boolean;
    editable?: boolean;
    mask?: any[];
}

export class CString extends ABase implements IString {
    mask: any[];
    editable: boolean;
    multiline: boolean;
    hideInput: boolean;
    component: React.ReactNode;

    constructor({component = null, hideInput = false, multiline = false, editable = true, mask = [], ...rest}: IString) {
        super(rest);

        this.mask = mask;
        this.component = component;
        this.editable = editable;
        this.multiline = multiline;
        this.hideInput = hideInput;
    }

    renderAddComponent = (params: IRender, type: Component): JSX.Element => this.asTextField({...params}, type);
    renderListComponent = (params: IRender, type: Component): JSX.Element => this.asTextField({...params}, type);
    renderFilterComponent = (params: IRender, type: Component): JSX.Element => this.asTextField({...params}, type);

    asTextField({value, onChange}: IRender, type: Component) {
        const {label, hideInput, mask, editable, multiline, component} = this;
        const overrideStringValue = value == null ? "" : value;

        if (component) {
            return React.cloneElement(component as any,
                {
                    label: label,
                    value: overrideStringValue,
                    onChangeEvent: (eventValue: string) => {
                        //const stateValue = eventValue == "" ? null : eventValue;
                        onChange(eventValue);
                    },
                },
            );
        }

        if (hideInput) {
            return (
                <PasswordField
                    label={label}
                    style={{minWidth: 300, marginTop: 0}}
                    value={overrideStringValue}
                    onChangeEvent={(eventValue: string) => {
                        //const stateValue = eventValue == "" ? null : eventValue;
                        onChange(eventValue);
                    }}/>
            );
        }

        if (mask.length > 0) {
            return (
                <InputMaskedField
                    editable={editable}
                    mask={mask}
                    style={{minWidth: 300, marginTop: 0}}
                    label={label}
                    value={overrideStringValue}
                    onChangeEvent={(eventValue: string) => {
                        //const stateValue = eventValue == "" ? null : eventValue;
                        onChange(eventValue);
                    }}/>
            );
        }

        return (
            <InputField
                multiline={multiline}
                rowsMax={multiline ? "4" : "1"}
                style={{minWidth: 300, marginTop: 0}}
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
