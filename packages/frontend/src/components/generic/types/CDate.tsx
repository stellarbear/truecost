import React from "react";
import {ABase, Component, IBase, IRender} from "./ABase";
import DateTimeField from "../../DateTimeField";
import {InputField} from "../../../components";

export interface IDate extends IBase {
    maxDate?: Date;
    minDate?: Date;
}

export class CDate extends ABase implements IDate {
    minDate: Date;
    maxDate: Date;

    constructor({minDate = new Date(), maxDate = new Date("2022-01-01"), ...rest}: IDate) {
        super(rest);

        this.minDate = minDate;
        this.maxDate = maxDate;
    }

    renderAddComponent = (params: IRender, type: Component): JSX.Element => this.asDateTimePicker({...params});
    renderListComponent = (params: IRender, type: Component): JSX.Element => this.asDateTimePicker({...params});
    renderFilterComponent = (params: IRender, type: Component): JSX.Element => this.asDateTimePicker({...params});

    asDateTimePicker({value, onChange}: IRender) {
        const {label, minDate, maxDate} = this;
        const overrideDateValue = value == null ? null : value;

        return (
            <DateTimeField
                style={{minWidth: 300}}
                label={label}
                value={overrideDateValue}
                onChangeEvent={(eventValue: number | null) => {
                    const stateValue = eventValue == null ? null : eventValue;
                    onChange(stateValue);
                }}/>
        );
    }

    asTextField({value, onChange}: IRender) {
        const {label, minDate, maxDate} = this;
        const overrideStringValue = value == null ? "" : new Date(value).toISOString();

        return (
            <InputField
                style={{minWidth: 300, marginTop: 0}}
                editable={false}
                label={label}
                value={overrideStringValue}
                onChangeEvent={(eventValue: string) => {
                }}/>
        );
    }
}
