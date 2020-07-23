import * as React from "react";
import {ABase, IRender, ICtor} from "./ABase";
import {isUndefined} from "@truecost/shared";
import {BooleanSelectField} from "../components/BooleanSelectField";
import SwitchField from "../components/SwitchField";
import DateTimeField, {IDateTimePickerType} from "../components/DateTimeField";

export interface IDate extends ICtor<Date> {
    max?: Date;
    min?: Date;
    type: IDateTimePickerType
}

export class CDate extends ABase<Date> {
    min: Date;
    max: Date;
    type: IDateTimePickerType

    constructor({type, min = new Date(), max = new Date("2022-01-01"), ...rest}: IDate) {
        super(rest);

        this.min = min;
        this.max = max;
        this.type = type;
    }

    renderAddImplementation = this.DateTimeField;
    renderFilterlementation = this.DateTimeField;
    renderListlementation = this.DateTimeField;

    DateTimeField({value, onChange}: IRender<Date>) {
        const {label, base} = this.data;
        const {min, max, type} = this;
        const overrideDateValue = value == null ? null : value;

        return (
            <DateTimeField
                type={type}
                label={label}
                value={value || min}
                onChangeEvent={onChange}/>
        );
    }
}
