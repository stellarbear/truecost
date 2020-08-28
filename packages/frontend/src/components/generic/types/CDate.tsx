import * as React from "react";
import {ABase, ICtor, IRender} from "./ABase";
import DateTimeField, {IDateTimePickerType} from "../components/DateTimeField";

export interface IDate extends ICtor<number> {
    max?: Date;
    min?: Date;
    type: IDateTimePickerType;
}

export class CDate extends ABase<number> {
    min: Date;
    max: Date;
    type: IDateTimePickerType;
    renderAddImplementation = this.DateTimeField;
    renderFilterlementation = this.DateTimeField;
    renderListlementation = this.DateTimeField;

    constructor({type, min = new Date(), max = new Date("2022-01-01"), ...rest}: IDate) {
        super(rest);

        this.min = min;
        this.max = max;
        this.type = type;
    }

    DateTimeField({value, onChange}: IRender<number>) {
        const {label} = this.data;
        const {min, type} = this;

        return (
            <DateTimeField
                type={type}
                label={label}
                value={value || +min}
                onChangeEvent={onChange}/>
        );
    }
}
