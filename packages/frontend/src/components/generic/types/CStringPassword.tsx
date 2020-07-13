import * as React from "react";
import {ABase, Component, IBase, IRender} from "./ABase";
import {PasswordField} from "components";

export interface IString extends IBase {
    component?: React.ReactNode;
}

export class CStringPassword extends ABase implements IString {
    component: React.ReactNode;

    constructor({component = null, ...rest}: IString) {
        super(rest);

        this.component = component;
    }

    renderAddComponent = (params: IRender, type: Component): JSX.Element => this.asTextField({...params}, type);
    renderListComponent = (params: IRender, type: Component): JSX.Element => this.asTextField({...params}, type);
    renderFilterComponent = (params: IRender, type: Component): JSX.Element => this.asTextField({...params}, type);

    asTextField({value, onChange}: IRender, type: Component) {
        const {label, component} = this;
        const overrideStringValue = value == null ? "" : value;

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
}
