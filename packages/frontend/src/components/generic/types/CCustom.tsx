import * as React from "react";
import {ABase, IRender, ICtor} from "./ABase";

export interface ICustom extends ICtor<string> {
    component: React.ReactNode;
    base: string
}

export class CCustom extends ABase<string> {
    component: React.ReactNode;

    constructor({component, ...rest}: ICustom) {
        super(rest);

        this.component = component;
    }


    renderAddImplementation = this.ClonedField;
    renderFilterlementation = this.NoControl;
    renderListlementation = this.ClonedField;

    ClonedField({value, onChange}: IRender<string>) {
        const {label, base} = this.data;
        const {component} = this;

        return React.isValidElement(component) && React.cloneElement(component,
            {
                label: label,
                value: value || base,
                onChangeEvent: onChange,
            },
        );
    }
}
