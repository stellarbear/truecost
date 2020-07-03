import React from "react";
import {ABase, Component, IBase, IRender} from "./ABase";
import {InputMaskedField} from "components";

export interface IString extends IBase {
    component?: React.ReactNode;
    editable?: boolean;
    mask: any[];
}

export class CStringMask extends ABase implements IString {
    mask: any[];
    editable: boolean;
    component: React.ReactNode;

    constructor({component = null, editable = true, mask = [], ...rest}: IString) {
        super(rest);

        this.mask = mask;
        this.editable = editable;
    }

    renderAddComponent = (params: IRender, type: Component): JSX.Element => this.asTextField({...params}, type);
    renderListComponent = (params: IRender, type: Component): JSX.Element => this.asTextField({...params}, type);
    renderFilterComponent = (params: IRender, type: Component): JSX.Element => this.asTextField({...params}, type);

    asTextField({value, onChange}: IRender, type: Component) {
        const {label, mask, editable, component} = this;
        const overrideStringValue = value == null ? "" : value;

        return (
            <InputMaskedField
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
}
