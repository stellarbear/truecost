import * as React from "react";
import {ABase, Component, IBase, IRender} from "./ABase";
import {SelectField, SwitchField} from "components";

export interface IBoolean extends IBase {
    textTrue: string;
    textFalse: string;
}

export class CBoolean extends ABase {
    textTrue: string;
    textFalse: string;

    constructor({textTrue, textFalse, ...rest}: IBoolean) {
        super(rest);
        this.textTrue = textTrue;
        this.textFalse = textFalse;
    }

    renderAddComponent = (params: IRender, type: Component): JSX.Element => this.asSwitch({...params});
    renderListComponent = (params: IRender, type: Component): JSX.Element => this.asSwitch({...params});
    renderFilterComponent = (params: IRender, type: Component): JSX.Element => this.asSelect({...params});

    asSelect({value, onChange}: IRender) {
        const {textTrue, textFalse, label} = this;
        const overrideBooleanValue = value == null ? -1 : (value ? 1 : 0);

        return (
            <SelectField
                label={label}
                style={{width: 200}}
                values={[-1, 0, 1]}
                value={overrideBooleanValue}
                baseValue={-1}
                preRenderMap={{
                    [-1]: "Any",
                    [1]: textTrue,
                    [0]: textFalse,
                }}
                onChangeEvent={(value: any) => {
                    const eventValue = value == null ? -1 : value;
                    const stateValue = eventValue == -1 ? null : (eventValue == 0 ? false : true);
                    onChange(stateValue);
                }}
            />
        );
    }

    asSwitch({value, onChange}: IRender) {
        const {textTrue, textFalse} = this;

        return (
            <SwitchField
                value={value}
                prefix={textFalse}
                suffix={textTrue}
                onChangeEvent={(value: boolean) => onChange(value)}
            />
        );

    }

    /*
        asCheckbox({ value, onChange }: IRender) {
            const { text, inverse } = this;

            return (
                <CheckBoxField
                    label={text}
                    checked={inverse ? !value : value}
                    onChangeEvent={(value) =>
                        onChange(inverse ? !value : value)
                    }
                />
            )
        }
    */
}
