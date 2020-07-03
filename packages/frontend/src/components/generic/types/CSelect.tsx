import React from "react";
import {SelectField} from "components";
import {ABase, Component, IBase, IRender} from "./ABase";

export interface ISelect extends IBase {
    values: any[];
    multiple?: boolean;
    preRenderMap?: Record<string, any>;
}

export class CSelect extends ABase {
    values: any[];
    multiple: boolean;
    preRenderMap?: Record<string, any>;

    constructor({values, multiple = false, preRenderMap, ...rest}: ISelect) {
        super(rest);
        this.values = values;
        this.multiple = multiple;
        this.preRenderMap = preRenderMap;
    }

    renderAddComponent = (params: IRender, type: Component): JSX.Element => this.asMultiSelect({...params});
    renderListComponent = (params: IRender, type: Component): JSX.Element => this.asMultiSelect({...params});
    renderFilterComponent = (params: IRender, type: Component): JSX.Element => this.asMultiSelect({...params});

    asMultiSelect({value, onChange}: IRender): JSX.Element {
        const {multiple, values, preRenderMap, label} = this;
        const overrideSelectValue = value == null ? [] : value;
        return (
            <SelectField
                style={{width: 200}}
                label={label}
                values={values}
                multiple={multiple}
                preRenderMap={preRenderMap}
                value={overrideSelectValue}
                onChangeEvent={(value: any) => {
                    const stateValue = Array.isArray(value)
                        ? value.length > 0 ? value : null
                        : value;
                    onChange(stateValue);
                }}
            />
        );
    }
}
