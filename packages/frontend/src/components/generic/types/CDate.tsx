import * as React from "react";
import {ABase, IRender, ICtor} from "./ABase";
import DateTimeField, {IDateTimePickerType} from "../components/DateTimeField";

export interface IDate extends ICtor<number> {
    max?: Date;
    min?: Date;
    type: IDateTimePickerType
}

export class CDate extends ABase<number> {
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

    DateTimeField({value, onChange}: IRender<number>) {
        const {label, base} = this.data;
        const {min, max, type} = this;

        return (
            <DateTimeField
                type={type}
                label={label}
                value={value || +min}
                onChangeEvent={onChange}/>
        );
    }
}
