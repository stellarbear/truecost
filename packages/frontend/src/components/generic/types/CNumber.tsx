import React from "react";
import {ABase, Component, IBase, IRender} from "./ABase";
import NumericField from "components/NumericField";
import RangeField from "components/RangeField";

export interface INumber extends IBase {
    min?: number;
    max?: number;
    step?: number;
    single?: boolean;
}

export class CNumber extends ABase implements INumber {
    min: number;
    max: number;
    step: number;
    single: boolean;

    constructor({min = 0, step = 10, single = true, max = Number.MAX_SAFE_INTEGER, ...rest}: INumber) {
        super(rest);

        this.min = min;
        this.max = max;
        this.step = step;
        this.single = single;
    }

    renderAddComponent = (params: IRender, type: Component): JSX.Element => this.asNumber({...params});
    renderListComponent = (params: IRender, type: Component): JSX.Element => this.asNumber({...params});
    renderFilterComponent = (params: IRender, type: Component): JSX.Element => this.asRange({...params});

    asRange({value, onChange}: IRender): JSX.Element {
        const {label, min, max, step, single} = this;

        if (value == undefined || Number.isInteger(value)) {
            value = {from: min, to: max};
        }

        return (
            <RangeField
                min={min}
                max={max}
                step={step}
                label={label}
                single={single}
                value={[value.from, value.to]}
                onChangeEvent={(eventValue: number[]) => {
                    if (eventValue.length == 2) {
                        onChange({
                            from: eventValue[0],
                            to: eventValue[1],
                        });
                    }
                }}
            />
        );
    }

    asNumber({value, onChange}: IRender): JSX.Element {
        const {label, min, max, single} = this;
        const overrideValue = value == null ? null : value;

        return (
            <NumericField
                min={min}
                max={max}
                single={single}
                label={label}
                value={overrideValue}
                onChangeEvent={(eventValue: number) => {
                    onChange(eventValue);
                }}
            />
        );
    }
}
