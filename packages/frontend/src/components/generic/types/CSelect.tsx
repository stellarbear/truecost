import * as React from "react";
import {ABase, ICtor, IRender} from "./ABase";
import {IOption, SelectField} from "../components/SelectField";

export interface ISelect extends ICtor<any> {
    multiple: boolean;
    options: IOption;
}

export class CSelect extends ABase<any> {
    options: IOption;
    multiple: boolean;
    renderAddImplementation = this.SelectField;
    renderFilterlementation = this.SelectField;
    renderListlementation = this.SelectField;

    constructor({options, multiple, ...rest}: ISelect) {
        super(rest);
        this.options = options;
        this.multiple = multiple;
    }

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
