import * as React from "react";
import {ABase, ICtor, IRender} from "./ABase";
import {NumericField} from "../components/NumericField";
import RangeField from "../components/RangeField";

export interface INumber extends ICtor<number> {
    min?: number;
    max?: number;
    step?: number;
    single?: boolean;
}

export class CNumber extends ABase<number> {
    min: number;
    max: number;
    step: number;
    single: boolean;
    renderAddImplementation = this.NumericField;
    renderFilterlementation = this.RangeField;
    renderListlementation = this.NumericField;

    constructor({min = 0, step = 10, single = true, max = Number.MAX_SAFE_INTEGER, base = min, ...rest}: INumber) {
        super({...rest, base});

        this.min = min;
        this.max = max;
        this.step = step;
        this.single = single;
    }

    NumericField({value, onChange}: IRender<number>) {
        const {base} = this.data;
        const {min, max} = this;

        return (
            <NumericField
                min={min}
                max={max}
                value={value || base || min}
                onChangeEvent={onChange}
            />
        );
    }

    RangeField({value, onChange}: IRender<[number, number]>) {
        const {min, max} = this;

        return (
            <RangeField
                value={value || [min, max]}
                label={"⟵ adjust ⟶"}
                labelLeft={'current'}
                labelRight={'desired'}
                min={min}
                max={max}
                onChangeEvent={onChange}
            />
        );
    }
}
