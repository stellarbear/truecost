import * as React from "react";
import {ABase, IRender, ICtor} from "./ABase";
import {BooleanSelectField} from "../components/BooleanSelectField";
import SwitchField from "../components/SwitchField";
import DateTimeField, {IDateTimePickerType} from "../components/DateTimeField";
import {SelectField, IOption} from "../components/SelectField";

export interface ISelect extends ICtor<any> {
    multiple: boolean;
    options: IOption;
}

export class CSelect extends ABase<any> {
    options: IOption;
    multiple: boolean;

    constructor({options, multiple, ...rest}: ISelect) {
        super(rest);
        this.options = options;
        this.multiple = multiple;
    }

    renderAddImplementation = this.SelectField;
    renderFilterlementation = this.SelectField;
    renderListlementation = this.SelectField;

    SelectField({value, onChange}: IRender<any | any[]>) {
        const {label} = this.data;
        const {multiple, options} = this;

        return (
            <SelectField
                label={label}
                options={options}
                multiple={multiple}
                value={value || (multiple ? [] : null)}
                onChangeEvent={onChange}
            />
        );
    }
}
